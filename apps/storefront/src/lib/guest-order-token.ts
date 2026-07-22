import { createHmac, timingSafeEqual } from "node:crypto";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_VERSION = 1;

export type GuestOrderTokenPayload = {
  version: number;
  orderId: string;
  nonce: string;
  expiresAt: number;
};

type SerializedPayload = {
  v: number;
  o: string;
  n: string;
  e: number;
};

function assertSecret(secret: string) {
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("STORE_GUEST_TRACKING_SECRET debe tener al menos 32 bytes.");
  }
}
function signatureFor(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function signGuestOrderToken(
  input: Omit<GuestOrderTokenPayload, "version">,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  assertSecret(secret);
  if (!UUID_PATTERN.test(input.orderId) || !UUID_PATTERN.test(input.nonce)) {
    throw new Error("El acceso invitado contiene identificadores inválidos.");
  }
  if (!Number.isSafeInteger(input.expiresAt) || input.expiresAt <= nowSeconds) {
    throw new Error("El acceso invitado ya venció o tiene una fecha inválida.");
  }

  const payload: SerializedPayload = {
    v: TOKEN_VERSION,
    o: input.orderId.toLowerCase(),
    n: input.nonce.toLowerCase(),
    e: input.expiresAt,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${signatureFor(body, secret)}`;
}

export function verifyGuestOrderToken(
  token: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): GuestOrderTokenPayload | null {
  try {
    assertSecret(secret);
    if (!token || token.length > 1024) return null;
    const pieces = token.split(".");
    if (pieces.length !== 2) return null;
    const [body, receivedSignature] = pieces;
    if (!body || !receivedSignature) return null;

    const expectedSignature = signatureFor(body, secret);
    const received = Buffer.from(receivedSignature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");
    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    ) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<SerializedPayload>;
    if (
      decoded.v !== TOKEN_VERSION ||
      typeof decoded.o !== "string" ||
      typeof decoded.n !== "string" ||
      !UUID_PATTERN.test(decoded.o) ||
      !UUID_PATTERN.test(decoded.n) ||
      !Number.isSafeInteger(decoded.e) ||
      (decoded.e as number) <= nowSeconds
    ) {
      return null;
    }

    return {
      version: TOKEN_VERSION,
      orderId: decoded.o.toLowerCase(),
      nonce: decoded.n.toLowerCase(),
      expiresAt: decoded.e as number,
    };
  } catch {
    return null;
  }
}
