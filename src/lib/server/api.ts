import "server-only";

import { ZodError } from "zod";
import { ConfigurationError } from "./env";

export function jsonResponse(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function routeError(error: unknown, context: string) {
  if (error instanceof ZodError) {
    return jsonResponse(
      {
        error: "Revisa los campos indicados.",
        fields: error.flatten().fieldErrors,
      },
      400,
    );
  }

  if (error instanceof SyntaxError) {
    return jsonResponse({ error: "El contenido enviado no es válido." }, 400);
  }

  if (error instanceof ConfigurationError) {
    console.error(`[${context}] configuración incompleta: ${error.message}`);
    return jsonResponse(
      { error: "El servicio está temporalmente fuera de línea." },
      503,
    );
  }

  if (error instanceof Error && error.message === "UNSUPPORTED_MEDIA_TYPE") {
    return jsonResponse({ error: "Formato de solicitud no permitido." }, 415);
  }

  if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
    return jsonResponse({ error: "La solicitud excede el tamaño permitido." }, 413);
  }

  console.error(`[${context}]`, error);
  return jsonResponse(
    { error: "No pudimos procesar la solicitud en este momento." },
    500,
  );
}
