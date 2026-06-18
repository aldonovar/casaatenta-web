import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      city,
      spaceType,
      serviceOfInterest,
      spaceStatus,
      scope,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Los campos Nombre, Correo y Teléfono son obligatorios." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // Simulate success if key is missing (for local testing & dev environment safety)
    if (!resendApiKey) {
      console.warn("--- [CASA ATENTA] RESEND_API_KEY no configurada. Simulando envío local. ---");
      console.log("Datos del lead:", {
        name,
        email,
        phone,
        city,
        spaceType,
        serviceOfInterest,
        spaceStatus,
        scope,
        message,
      });
      return NextResponse.json({ success: true, simulated: true });
    }

    // Prepare email HTML body with clean layout
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0C2742; border-bottom: 2px solid #D8B36A; padding-bottom: 10px;">Nuevo Lead de Contacto - Casa Atenta</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px;">Nombre:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Teléfono / WhatsApp:</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Correo:</td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Ubicación:</td>
            <td style="padding: 8px 0;">${city}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Tipo de Espacio:</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${spaceType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Servicio de Interés:</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${serviceOfInterest}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Estado del Espacio:</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${spaceStatus === "proyecto" ? "En Proyecto (Planos)" : "Ya Existe"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Alcance del Trabajo:</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${scope}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D8B36A; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Detalles de la Obra:</h4>
          <p style="margin: 0; line-height: 1.6; color: #555;">${message ? message.replace(/\n/g, "<br>") : "Sin mensaje adicional."}</p>
        </div>
        
        <footer style="margin-top: 30px; text-align: center; font-size: 11px; color: #888;">
          Este correo fue generado automáticamente desde el formulario web de Casa Atenta.
        </footer>
      </div>
    `;

    // Make direct HTTP request to Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Casa Atenta Leads <onboarding@resend.dev>",
        to: "contacto@casa-atenta.com",
        subject: `Nuevo Lead: ${name} (${spaceType})`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error response:", errorData);
      return NextResponse.json(
        { error: "Error enviando el correo a través de Resend." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in contact route:", error);
    return NextResponse.json(
      { error: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}
