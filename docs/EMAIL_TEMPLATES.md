# Plantillas de correo de Casa Atenta

Las plantillas transaccionales viven en `src/lib/server/email.ts` y se envían
mediante Resend. El HTML está pensado para Gmail, Apple Mail y Outlook:

- estructura por tablas y estilos en línea;
- ancho máximo de 640 px y versión móvil fluida;
- cabecera de marca compartida con el wordmark PNG de Casa Atenta, texto
  alternativo y dimensiones explícitas para Outlook;
- paleta navy y dorado, tipografía de sistema y modo oscuro intencional con
  contraste reforzado;
- texto alternativo completo para clientes que bloquean HTML;
- preencabezado discreto y asuntos sin datos personales sensibles;
- enlaces visibles como alternativa a los botones;
- sin fuentes externas, JavaScript, formularios, píxeles ni seguimiento de clics;
- pie transaccional, aviso de confidencialidad en notificaciones internas y
  aviso de remitente automático en HTML y texto plano.

El recurso de marca para correo es
`public/email/casa-atenta-wordmark-white-v1@2x.png`. Se sirve desde una URL
absoluta del propio dominio y se muestra a 300 × 48 px; el archivo incluye
margen transparente y resolución doble para conservar nitidez. No debe
reemplazarse por SVG, Base64, WebP ni una URL temporal.

El logotipo dentro del contenido no controla el avatar que muestra Gmail junto
al remitente. Esa identidad de bandeja se gestionará por separado mediante
Apple Branded Mail y, cuando DMARC se encuentre en cumplimiento estricto y sea
conveniente asumir el certificado requerido, BIMI.

## Política de remitentes

- `notificaciones@casa-atenta.com` es la identidad exclusiva para los envíos
  automáticos de formularios, Libro de Reclamaciones y newsletter. No es una
  bandeja independiente ni monitoreada.
- Todas las plantillas informan que no se debe escribir directamente a
  `notificaciones@casa-atenta.com` y remiten cualquier comunicación a
  `info@casa-atenta.com`.
- Los mensajes automáticos dirigidos a clientes usan
  `Reply-To: info@casa-atenta.com`, por lo que la respuesta llega a la bandeja
  operativa aunque el remitente visible sea `notificaciones@casa-atenta.com`.
- `febjon@casa-atenta.com` y `aldonovar@casa-atenta.com` quedan reservados para
  correos manuales de gerencia enviados únicamente bajo instrucción explícita.
  Ningún formulario, cron, webhook o campaña puede seleccionarlos de forma
  automática.

## Familias disponibles

| Clave de vista previa | Uso |
| --- | --- |
| `contact-receipt` | Acuse de recibo para solicitudes y cotizaciones |
| `contact-notification` | Aviso interno de una nueva solicitud |
| `claim-receipt` | Copia del Libro de Reclamaciones para el consumidor |
| `claim-notification` | Aviso interno de un reclamo o una queja |
| `newsletter-confirmation` | Doble confirmación de la suscripción, protegida ante escáneres de enlaces |
| `newsletter-welcome` | Bienvenida después de confirmar, con baja en un clic |

## Vista previa local

La ruta de desarrollo no existe en producción. Con `npm run dev`, abre:

`http://localhost:3000/api/dev/email-preview?template=contact-receipt`

Cambia el valor de `template` por cualquiera de las claves de la tabla. La
validación final debe hacerse enviando un ejemplar real a Gmail, Outlook y, si
está disponible, Apple Mail, porque cada cliente aplica reglas propias.

## Criterio de aprobación

1. SPF, DKIM y DMARC deben mostrar `pass` en los encabezados recibidos.
2. El remitente y `Reply-To` deben ser de Casa Atenta.
3. La bandeja debe mostrar asunto y preencabezado sin texto técnico.
4. El contenido debe ser legible con imágenes bloqueadas y a 320 px de ancho.
5. El logotipo debe responder `200` con `Content-Type: image/png` desde el
   dominio de producción antes de enviar una prueba real.
6. Los botones y enlaces de texto deben abrir únicamente `https://www.casa-atenta.com`.
7. Los mensajes de newsletter deben incluir `List-Unsubscribe` y baja en un clic.
