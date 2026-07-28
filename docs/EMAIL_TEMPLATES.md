# Plantillas de correo de Casa Atenta

Las plantillas transaccionales viven en `src/lib/server/email.ts` y se envían
mediante Resend. El HTML está pensado para Gmail, Apple Mail y Outlook:

- estructura por tablas y estilos en línea;
- ancho máximo de 640 px y versión móvil fluida;
- cabecera de marca compacta con el wordmark SVG de Casa Atenta y un PNG retina
  de respaldo, texto alternativo y dimensiones explícitas para Outlook;
- paleta navy y dorado, tipografía de sistema y modo oscuro intencional con
  contraste reforzado;
- texto alternativo completo para clientes que bloquean HTML;
- preencabezado discreto y asuntos sin datos personales sensibles;
- enlaces visibles como alternativa a los botones;
- sin fuentes externas, JavaScript, formularios, píxeles ni seguimiento de clics;
- pie transaccional, aviso de confidencialidad en notificaciones internas y
  aviso de remitente automático en HTML y texto plano.
- caracteres Unicode normalizados y codificados como entidades HTML numéricas
  para evitar mojibake aunque un intermediario interprete mal el charset.

El recurso vectorial canónico para correo es
`public/email/casa-atenta-wordmark-white-v2.svg`. Tiene un `viewBox` ajustado al
dibujo y se muestra a 243 × 42 px. La plantilla ofrece
`public/email/casa-atenta-wordmark-white-v2@2x.png` como respaldo retina para
Outlook y clientes que no procesan SVG. Ambos se sirven desde URLs absolutas del
propio dominio; no deben sustituirse por Base64, WebP ni una URL temporal.

El tracking de aperturas y clics debe permanecer desactivado en el dominio de
Resend. El webhook reconoce esos tipos de evento por compatibilidad, pero no
envía alertas de interacción ni constituye autorización para activar píxeles o
reescritura de enlaces. Solo los incidentes de entrega generan una alerta
interna: se reserva primero en un outbox durable, usa una clave idempotente por
evento, conserva el motivo exacto y reclama cada intento de forma atómica antes
de reintentar sin tratar un fallo transitorio como éxito.

El logotipo dentro del contenido no controla el avatar que muestra Gmail junto
al remitente. Esa identidad de bandeja se gestionará por separado mediante
Apple Branded Mail y, cuando DMARC se encuentre en cumplimiento estricto y sea
conveniente asumir el certificado requerido, BIMI.

## Política de remitentes

- Las familias heredadas de formularios, Libro de Reclamaciones y newsletter
  usan la política de remitente automático documentada para
  `notificaciones@casa-atenta.com`.
- Todas las plantillas informan que no se debe escribir directamente a
  `notificaciones@casa-atenta.com` y remiten cualquier comunicación a
  `info@casa-atenta.com`.
- Los mensajes automáticos dirigidos a clientes usan
  `Reply-To: info@casa-atenta.com`, por lo que la respuesta llega a la bandeja
  operativa aunque el remitente visible sea `notificaciones@casa-atenta.com`.
- **Las cotizaciones son una excepción deliberada:** salen exactamente como
  `Casa Atenta <info@casa-atenta.com>` y usan
  `Reply-To: info@casa-atenta.com`. Ese buzón sí existe y se atiende en
  Namecheap Private Email; Resend solo realiza la salida.
- `febjon@casa-atenta.com` y `aldonovar@casa-atenta.com` quedan reservados para
  correos manuales de gerencia enviados únicamente bajo instrucción explícita.
  Ningún formulario, cron, webhook o campaña puede seleccionarlos de forma
  automática.

## Familias disponibles

| Clave de vista previa     | Uso                                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| `quotation-delivery`      | Entrega formal de cotización/render con PDF adjunto y modo de prueba      |
| `contact-receipt`         | Acuse de recibo para solicitudes y cotizaciones                           |
| `contact-notification`    | Aviso interno de una nueva solicitud                                      |
| `claim-receipt`           | Copia del Libro de Reclamaciones para el consumidor                       |
| `claim-notification`      | Aviso interno de un reclamo o una queja                                   |
| `newsletter-confirmation` | Doble confirmación de la suscripción, protegida ante escáneres de enlaces |
| `newsletter-welcome`      | Bienvenida después de confirmar, con baja en un clic                      |

## Vista previa local

La ruta de desarrollo no existe en producción. Con `npm run dev`, abre:

`http://localhost:3000/api/dev/email-preview?template=contact-receipt`

Cambia el valor de `template` por cualquiera de las claves de la tabla. La
validación final debe hacerse enviando un ejemplar real a Gmail, Outlook y, si
está disponible, Apple Mail, porque cada cliente aplica reglas propias.

La vista `quotation-delivery` solo previsualiza HTML; no adjunta ni publica el
PDF y no ejecuta Resend. El archivo real se procesa en memoria desde la consola
privada, con máximo 4 MiB, MIME `application/pdf`, firma `%PDF-` y nombre
`Casa-Atenta-Cotizacion-<numero>.pdf`.

## Criterio de aprobación

1. SPF, DKIM y DMARC deben mostrar `pass` en los encabezados recibidos.
2. El remitente y `Reply-To` deben ser de Casa Atenta.
3. La bandeja debe mostrar asunto y preencabezado sin texto técnico.
4. El contenido debe ser legible con imágenes bloqueadas y a 320 px de ancho.
5. El SVG y su respaldo PNG deben responder `200` con `Content-Type` correcto
   (`image/svg+xml` e `image/png`) desde producción antes de una prueba real.
6. En producción, el render debe abrir por HTTPS bajo `casa-atenta.com`,
   `www.casa-atenta.com` o mediante un enlace directo de archivo/carpeta en
   `drive.google.com`; los demás hosts quedan bloqueados.
7. Los mensajes de newsletter deben incluir `List-Unsubscribe` y baja en un clic.
8. Una cotización de prueba debe ser visualmente idéntica al mensaje final y
   limitarse a la allowlist server-side; auditoría y tags conservan el modo de
   prueba sin mostrarlo a quien recibe, y cada destinatario obtiene un mensaje e
   ID de Resend independientes.
9. Una respuesta a la cotización debe llegar a `info@casa-atenta.com` en
   Namecheap Private Email. La aceptación de Resend no valida por sí sola ese
   recorrido de respuesta.
