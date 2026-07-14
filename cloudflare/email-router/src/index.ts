const ALLOWED_RECIPIENTS = [
  "info@casa-atenta.com",
  "notificaciones@casa-atenta.com",
  "febjon@casa-atenta.com",
  "aldonovar@casa-atenta.com",
] as const;

export default {
  async email(message, env): Promise<void> {
    const recipient = message.to.trim().toLowerCase();

    if (!ALLOWED_RECIPIENTS.some((allowed) => allowed === recipient)) {
      console.warn(
        JSON.stringify({
          event: "email_rejected",
          reason: "unknown_recipient",
          recipient,
        }),
      );
      message.setReject("Unknown recipient");
      return;
    }

    await Promise.all([
      message.forward(env.DESTINATION_FEBJON),
      message.forward(env.DESTINATION_STEAMDUSK),
    ]);

    console.log(
      JSON.stringify({
        event: "email_forwarded",
        recipient,
        destinationCount: 2,
      }),
    );
  },
} satisfies ExportedHandler<Env>;
