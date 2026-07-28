# Correo y autenticación de dominio de Casa Atenta

Documento operativo actualizado el 16 de julio de 2026 para
`casa-atenta.com`. La auditoría del 13 de julio se conserva más abajo como
historial, pero no representa una autorización para cambiar DNS.

## Arquitectura vigente

- Cloudflare es el DNS autoritativo y la cuenta compartida desde la que se
  administran los registros de la zona.
- **Namecheap Private Email es el servicio de recepción y el buzón actual de
  `info@casa-atenta.com`.** Sus MX no se deben sustituir ni eliminar sin una
  migración de correo aprobada, una ventana de cambio y pruebas de recepción.
- Resend, en la infraestructura separada de Casa Atenta, es el proveedor de
  salida transaccional.
- Las cotizaciones salen exactamente como
  `Casa Atenta <info@casa-atenta.com>` y usan
  `Reply-To: info@casa-atenta.com`; la respuesta vuelve al buzón de Namecheap.
- Supabase, también bajo la infraestructura separada de Casa Atenta, conserva
  datos operativos y auditoría server-side. Turnstile protege los formularios
  públicos que lo requieren.
- Vercel ejecuta la aplicación. Los secretos runtime se cargan allí y no se
  obtienen de los accesos OAuth/MCP de Codex.

### Flujo actual de una cotización

1. La aplicación entrega el mensaje y uno o dos PDFs a Resend mediante HTTPS.
2. Resend autentica y envía el correo usando los registros SPF/DKIM ya
   verificados para su flujo de salida.
3. Si la destinataria responde, su proveedor consulta los MX de
   `casa-atenta.com`.
4. Esos MX conducen la respuesta a Namecheap Private Email, donde se atiende el
   buzón `info@casa-atenta.com`.

Cloudflare no almacena ese buzón y Resend no recibe las respuestas. Ser DNS
autoritativo tampoco convierte a Cloudflare en proveedor de correo.

### MX frente a SPF, DKIM y DMARC

| Registro o servicio           | Función                                                               | Qué no hace                       |
| ----------------------------- | --------------------------------------------------------------------- | --------------------------------- |
| MX de Namecheap Private Email | Decide dónde se recibe el correo dirigido a `@casa-atenta.com`        | No autoriza a Resend para enviar  |
| SPF                           | Declara qué infraestructura puede enviar para un hostname/Return-Path | No crea ni mueve buzones          |
| DKIM                          | Firma el mensaje y permite verificar dominio e integridad             | No controla la ruta de respuestas |
| DMARC                         | Exige alineación con el dominio visible y define política/reportes    | No reemplaza MX, SPF ni DKIM      |
| Resend                        | Envía y reporta eventos transaccionales                               | No es el buzón de `info@`         |

Debe existir un solo registro SPF por hostname. Los registros solicitados por
Resend suelen vivir en su selector DKIM y/o subdominio de Return-Path; no se
debe crear un segundo SPF raíz. Cambiar SPF/DKIM/DMARC no migra la recepción,
pero cambiar MX sí puede interrumpirla.

## Auditoría histórica y plan anterior

El 13 de julio de 2026 se evaluó migrar la recepción a Cloudflare Email Routing
y un Email Worker. Ese plan quedó **superado por la confirmación posterior de
que Namecheap Private Email es el buzón/MX operativo**. Los datos siguientes se
conservan como snapshot histórico y deben verificarse de nuevo antes de usarse:

- Nameservers activos: `fish.ns.cloudflare.com` y `jimmy.ns.cloudflare.com`.
- En ese snapshot se observaron MX `eforward1` a
  `eforward5.registrar-servers.com` y SPF
  `v=spf1 include:spf.efwd.registrar-servers.com ~all`; no deben asumirse como
  el estado actual ni modificarse a partir de este documento.
- DMARC Management está activo con una política inicial `p=none` y reportes agregados en Cloudflare.
- Resend verificó el dominio, DKIM y el Return-Path `send.casa-atenta.com`.
- No existe registro MTA-STS en `_mta-sts.casa-atenta.com`.
- No existe registro TLS-RPT en `_smtp._tls.casa-atenta.com`.
- No se encontró DS público; DNSSEC debe revisarse y activarse después de estabilizar la zona.
- El Worker `casa-atenta-email-router` ya está desplegado, sin endpoint
  `workers.dev`, con ambos destinos configurados como secretos.
- Cloudflare Email Routing estaba desactivado. Uno de los dos destinos del plan
  anterior estaba verificado y el segundo seguía pendiente.

No se autoriza activar ese plan, cambiar MX, cancelar Namecheap Private Email ni
alterar la recepción desde esta tarea.

### Transferencia del registrador

- `casa-atenta.com` fue registrado el 16 de junio de 2026. Cloudflare lo marca como no transferible durante los primeros 60 días; se debe volver a comprobar a partir del 15 de agosto de 2026.
- El dominio quedó nuevamente bloqueado en Namecheap mientras vence ese plazo. No debe permanecer desbloqueado sin una transferencia activa.
- Cloudflare mostró un precio de `10,46 US$` antes de impuestos, con un año adicional de registro y renovación al mismo precio vigente. Cualquier cobro debe confirmarse nuevamente en la fecha de transferencia.
- En la fecha elegible: desbloquear, solicitar un Auth/EPP nuevo, volver a comprobar en Cloudflare y completar el pago. El Auth/EPP es confidencial y solo debe introducirse directamente en Cloudflare.
- Namecheap muestra un plan Private Email separado, con un buzón en uso y
  vigencia hasta el 18 de julio de 2027. Transferir el dominio no cancela
  automáticamente ese producto. La declaración operativa posterior confirma
  que ese servicio es la recepción actual.

## 1. Plan anterior: Cloudflare Email Routing (no ejecutar)

Esta sección se conserva para trazabilidad. No describe la arquitectura actual
y no autoriza ninguna acción. Solo podría reactivarse como proyecto de
migración separado, con inventario de buzones, exportación/retención,
verificación de destinos, rollback y aprobación explícita.

En Cloudflare: **Compute → Email Service → Email Routing**.

1. [Histórico] Completar la verificación de los dos destinos operativos. No activar la
   recepción mientras alguno continúe pendiente.
2. Activar Email Routing para `casa-atenta.com`.
3. Permitir que Cloudflare cree y bloquee sus registros administrados:
   - MX `@` hacia `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net` y `route3.mx.cloudflare.net`.
   - SPF único en `@`: `v=spf1 include:_spf.mx.cloudflare.net ~all`.
   - DKIM de enrutamiento con el selector entregado por Cloudflare.
4. Inventariar las identidades funcionales e internas en un registro operativo
   privado antes de crear reglas hacia el Worker; las direcciones personales y
   de destino no se documentan en Git.
5. Definir los destinos de reportes DMARC/TLS-RPT directamente en el proveedor,
   sin confirmar sus direcciones en este repositorio.
6. Mantener el catch-all desactivado o configurado para descartar. Esto evita recibir spam dirigido a direcciones inventadas.
7. Después de validar la recepción, retirar los cinco MX `eforward*` y el SPF de `spf.efwd.registrar-servers.com` si Cloudflare no los reemplazó automáticamente.

Debe existir un solo TXT que empiece por `v=spf1` en cada hostname. No se crearán registros SPF paralelos.

Cloudflare Email Routing reenvía mensajes; no es un buzón con carpetas. El filtrado final, las respuestas manuales y la cuarentena también dependen del proveedor de la dirección de destino.

La observación histórica sobre respuestas desde Gmail solo aplicaba al plan de
reenvío. En la arquitectura vigente se responde desde el buzón corporativo de
Namecheap Private Email.

## 2. Resend para salida

1. El dominio `casa-atenta.com` ya está verificado en Resend para enviar desde la región `sa-east-1`.
2. DKIM y el Return-Path `send` ya están verificados en Cloudflare como registros DNS.
3. No añadir un segundo SPF en `@`. Resend normalmente autentica el Return-Path en un subdominio; si el panel pidiera modificar el SPF raíz, se debe detener el cambio y revisar el registro existente antes de proponer una única política combinada.
4. Para cotizaciones, configurar el remitente exactamente como
   `Casa Atenta <info@casa-atenta.com>` y
   `Reply-To: info@casa-atenta.com`. El servidor rechaza una configuración de
   remitente distinta.
5. Después de publicar la nueva versión, crear un webhook en Resend hacia:

   `https://www.casa-atenta.com/api/webhooks/resend`

6. Suscribir al menos los eventos de entrega, rebote y queja. Copiar el Signing Secret en `RESEND_WEBHOOK_SECRET`.

La aplicación usa claves de idempotencia, verifica la firma Svix del webhook y suprime automáticamente del newsletter las direcciones con rebote permanente o queja de spam.

Resend solo maneja la salida y sus eventos. La entrega de una respuesta a
`info@casa-atenta.com` depende de los MX y del buzón de Namecheap Private Email.
No se requiere cambiar MX para usar Resend como emisor.

## 3. DMARC por etapas

Cloudflare DMARC Management publicó la etapa inicial de observación el 13 de
julio de 2026. La dirección de reportes se conserva únicamente en el proveedor
y no se reproduce en Git; verificar allí el TXT vigente antes de proponer un
cambio.

Mantener `p=none` hasta observar que Cloudflare, Resend y cualquier otra fuente legítima pasan DMARC. Después:

1. `p=quarantine; pct=25` durante una semana.
2. Subir gradualmente a `pct=100`.
3. Pasar a `p=reject; pct=100` cuando no existan fuentes legítimas sin alinear.
4. Evaluar `adkim=s; aspf=s` solo después de estabilizar el envío.

No se debe publicar `p=reject` el primer día: podría bloquear fuentes legítimas todavía desconocidas.

## 4. Plan anterior: MTA-STS y TLS-RPT para MX de Cloudflare

El archivo y los registros descritos en esta sección se prepararon para el plan
anterior de Cloudflare Email Routing. **No se deben publicar ni promover a
`enforce` mientras Namecheap Private Email sea el receptor actual.** Cualquier
política MTA-STS futura debe listar exactamente los MX vigentes del proveedor
receptor; publicar una política para hosts distintos puede bloquear correo
entrante legítimo.

El repositorio incluye `public/.well-known/mta-sts.txt` en modo `testing` para los tres MX de Cloudflare.

1. Añadir `mta-sts.casa-atenta.com` como dominio del despliegue y asegurar HTTPS válido.
2. Verificar que esta URL responda sin redirecciones y como texto plano:

   `https://mta-sts.casa-atenta.com/.well-known/mta-sts.txt`

3. Publicar:

```dns
Type: TXT
Name: _mta-sts
Value: v=STSv1; id=20260713
TTL: Auto
```

4. Publicar TLS-RPT solo con una dirección de reportes verificada y administrada
   fuera del repositorio:

```dns
Type: TXT
Name: _smtp._tls
Value: v=TLSRPTv1; rua=mailto:REPLACE_WITH_VERIFIED_REPORT_ADDRESS
TTL: Auto
```

5. Tras revisar reportes sin fallos, cambiar el archivo a `mode: enforce`, aumentar `max_age` y actualizar el valor `id` de `_mta-sts`.

## 5. Supabase

El proyecto gratuito `casa-atenta-production` está activo en la región
`sa-east-1`. La migración remota y el archivo local comparten la versión
`20260714030330`:
`supabase/migrations/20260714030330_email_forms_foundation.sql`.

La cuenta de Supabase de este proyecto es distinta del conector global/personal
de Codex. El MCP local se configura en `.codex/config.toml` y ya está fijado al
`project_ref` verificado `vywtnakijogqoiumnqaa`, con `read_only=true`. OAuth de
Codex no sustituye `SUPABASE_URL` ni
`SUPABASE_SECRET_KEY` del runtime.

1. La migración base `20260714030330_email_forms_foundation.sql` debe aparecer
   aplicada antes de operar los formularios.
2. La migración de cotizaciones debe crear
   `quotation_email_deliveries`; verificarla de forma independiente antes del
   primer envío.
3. La migración `20260726233537_email_event_alert_outbox.sql` debe agregar el
   estado durable de alertas a `email_events` antes de desplegar el webhook que
   lo utiliza.
4. `anon` y `authenticated` no tienen permisos sobre estas tablas ni sobre la
   función de rate limiting; `service_role` conserva solo los permisos
   explícitos necesarios.
5. Los avisos informativos de RLS sin políticas son intencionales cuando no
   existe acceso directo desde clientes; todo error o advertencia adicional de
   Database Advisors se debe resolver antes de desplegar.
6. Configurar una Secret key moderna `sb_secret_...` como
   `SUPABASE_SECRET_KEY`. `service_role` solo queda como compatibilidad
   temporal.
7. No exponer ninguna de estas claves con el prefijo `NEXT_PUBLIC_`.

Las tablas tienen RLS activo, no conceden acceso a `anon` ni `authenticated` y solo la capa de servidor recibe permisos explícitos.

La tarea programada aplica minimización de datos: elimina las huellas de
contacto y reclamos a los 30 días, las huellas del historial de consentimiento
a los 90 días, redacta destinatario y carga completa de webhooks a los 30 días,
elimina su metadata a los 180 días y elimina las auditorías técnicas de
cotizaciones al cumplir 365 días. El historial de consentimiento conserva
evento, versión y fecha.

## 6. Turnstile

1. El widget administrado `Casa Atenta Web` ya existe y solo admite `casa-atenta.com` y `www.casa-atenta.com`.
2. Añadir `localhost` únicamente en el widget de pruebas, nunca como hostname de producción.
3. Configurar la Site Key pública y la Secret Key privada.
4. Comprobar en Turnstile Analytics las acciones:
   - `contact_form`
   - `consumer_claim`
   - `newsletter_subscription`

El servidor valida token, acción, hostname, uso único y caducidad antes de guardar datos.
Las claves de `.env.local` fueron comparadas por huella criptográfica con Cloudflare y coinciden; la clave secreta no se expone en el repositorio.

## 7. Variables de despliegue

Copiar los nombres de `.env.example` a Vercel o al proveedor de hosting. Los
secretos reales no deben guardarse en el repositorio. Resend y Supabase usan la
infraestructura separada de Casa Atenta; las sesiones OAuth de los MCP locales
`casaatenta_resend` y `casaatenta_supabase` son independientes de estos secretos
runtime y no se deben reutilizar fuera de este proyecto.

### Reintentos automáticos

`vercel.json` programa `/api/cron/email-retry` una vez al día a las 10:07 UTC
(05:07 de Lima), frecuencia compatible con el límite técnico de Vercel Hobby.
Configurar `CRON_SECRET` con al menos 32 caracteres en Vercel; la plataforma lo
enviará como Bearer token. La tarea reintenta hasta cinco veces las
notificaciones y recibos de contacto, las copias del Libro de Reclamaciones, la
confirmación de doble opt-in y la bienvenida del newsletter. Las claves
idempotentes son estables y también recuperan registros cuyo envío terminó,
pero cuyo estado no alcanzó a persistirse en Supabase. También recupera alertas
de incidentes de cotizaciones que quedaron en el outbox con estado `pending` o
`failed`; el webhook solicita además un reintento inmediato devolviendo `503`
si la alerta no pudo completarse.

Los envíos normales siguen siendo inmediatos; el cron solo recupera fallos
excepcionales. Al pasar el proyecto a un plan comercial compatible, conviene
restaurar la expresión horaria `7 * * * *`. Además del límite de cron, se debe
confirmar que el plan de hosting autoriza el uso comercial de Casa Atenta.

Variables obligatorias:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `RESEND_FROM_EMAIL`
- `QUOTATION_RESEND_FROM_EMAIL` (opcional; solo acepta el `From` exacto de cotizaciones)
- `QUOTATION_AUDIT_SECRET`
- `QUOTATION_TEST_RECIPIENTS`
- `QUOTATION_ALERT_RECIPIENTS` (buzones operativos; no reutilizar automáticamente la allowlist de pruebas)
- `QUOTATION_PRODUCTION_ENABLED` (fail-closed; mantener `false` hasta autorización expresa)
- `CONTACT_INBOX`
- `QUOTATION_ADMIN_ACCESS_TOKEN`
- `QUOTATION_ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES`
- `RATE_LIMIT_SECRET`
- `NEWSLETTER_TOKEN_SECRET`
- `NEXT_PUBLIC_SITE_URL`

`NEWSLETTER_TOKEN_SECRET` debe mantenerse estable: rotarlo invalida los enlaces de baja enviados anteriormente.

Para habilitar la consola de cotizaciones y su auditoría, los tres secretos
`QUOTATION_AUDIT_SECRET`, `QUOTATION_ADMIN_ACCESS_TOKEN` y
`QUOTATION_ADMIN_SESSION_SECRET` deben tener al menos 32 caracteres, ser
independientes y no reutilizar
`RESEND_API_KEY`, claves de Supabase ni contraseñas de Namecheap.
`RESEND_FROM_EMAIL` conserva el remitente general de la web; el módulo de
cotizaciones fija por defecto `Casa Atenta <info@casa-atenta.com>` y solo acepta
`QUOTATION_RESEND_FROM_EMAIL` cuando coincide exactamente con ese valor. El
storefront mantiene su propia configuración en su entorno independiente.

`QUOTATION_ALERT_RECIPIENTS` se configura aparte de
`QUOTATION_TEST_RECIPIENTS`: los incidentes de rebote, queja y supresión solo se
notifican a los buzones operativos designados, aunque la allowlist de pruebas
contenga más direcciones.

La ausencia de cualquiera de los secretos requeridos deja la consola
indisponible. Enviar a producción exige, además, que
`QUOTATION_PRODUCTION_ENABLED` sea exactamente `true`, que los PDFs hayan sido
confirmados como revisados y que el operador escriba la frase literal asociada al
número de cotización. El modo de prueba no elimina ni satisface esos controles.

## 8. Verificación de salida

Después del despliegue:

1. Enviar pruebas a Gmail, Outlook y Yahoo.
2. Revisar encabezados: SPF, DKIM y DMARC deben mostrar `pass`.
3. Confirmar que el formulario se guarda en Supabase aunque Resend falle temporalmente.
4. Confirmar la recepción del webhook y su deduplicación.
5. Probar rebote con una dirección de prueba de Resend y verificar la supresión.
6. Verificar que un token Turnstile repetido sea rechazado.
7. Revisar semanalmente reportes DMARC, rebotes y quejas durante el primer mes.
8. Desde `/admin/cotizaciones`, ejecutar primero el modo de prueba; la allowlist
   solo admite los destinatarios internos configurados y crea un envío
   individual por dirección.
9. Confirmar en cada resultado un ID de Resend y una fila de auditoría
   server-side sin PDF ni correo completo.
10. Responder a un mensaje de prueba y comprobar que la respuesta llega a
    `info@casa-atenta.com` en Namecheap Private Email.
11. Confirmar en Resend que apertura y clic continúan desactivados; una
    cotización de producción solo puede incluir el render bajo
    `casa-atenta.com`, `www.casa-atenta.com` o como enlace directo de
    archivo/carpeta en `drive.google.com`.
12. Ejecutar `npm run email:deliverability:check` y conservar el resultado con
    la revisión operativa.
13. No cambiar DNS durante esta verificación. SPF, DKIM y DMARC se inspeccionan;
    los MX actuales se conservan.

El procedimiento completo, incluidos errores, idempotencia, rollback y
corrección/reenvío, está en `docs/QUOTATION_EMAIL_SYSTEM.md`.

## 9. Reputación, filtrado y presencia de marca

Ningún proveedor puede garantizar el 100 % de entrega en bandeja principal ni
cero spam. El objetivo verificable es que la autenticación, la alineación, la
higiene de listas y las tasas de queja permanezcan saludables.

1. Registrar el dominio en Google Postmaster Tools y Yahoo Sender Hub cuando
   exista volumen suficiente. Vigilar reputación, errores de entrega y quejas.
2. Mantener la tasa de spam por debajo de `0,1 %` como objetivo interno y nunca
   acercarse al límite de `0,3 %` indicado por Gmail para remitentes masivos.
3. Usar doble opt-in, baja de un clic, supresión inmediata de rebotes y quejas,
   y no comprar, alquilar ni importar listas sin consentimiento demostrable.
4. Aumentar el volumen de forma orgánica y estable. En la etapa actual conviene
   mantener la IP compartida de Resend; una IP dedicada sin volumen constante
   puede perjudicar la reputación.
5. Mantener el catch-all desactivado. En cada Gmail de destino, crear filtros de
   cuarentena para remitentes repetitivos solo después de confirmar falsos
   positivos; no hacer reenvíos automáticos adicionales que creen bucles.
6. Usar el wordmark PNG autohospedado en todas las plantillas. El avatar de la
   bandeja es independiente: evaluar Apple Branded Mail primero y BIMI después
   de alcanzar DMARC estricto.
7. Separar en el futuro el tráfico de newsletter del transaccional mediante un
   subdominio de envío cuando el volumen y el plan de Resend lo justifiquen.

La revisión operativa debe incluir Gmail, Outlook y Yahoo reales, encabezados
`Authentication-Results`, visualización con imágenes bloqueadas, modo oscuro y
pantalla de 320 px. La aceptación de la API de Resend no demuestra por sí sola
que un mensaje haya llegado a Inbox.

## BIMI

BIMI queda pospuesto. Solo tiene sentido después de aplicar DMARC con `p=quarantine` o `p=reject`, preparar un SVG compatible y decidir si se adquirirá un certificado VMC/CMC. No mejora por sí solo la entregabilidad.

## Revisión de dependencias

- Next.js y `eslint-config-next` están fijados en la versión estable `16.2.10`.
- `@supabase/supabase-js` está fijado en `2.110.1`; se evitó adoptar una publicación del mismo día para respetar la ventana de seguridad de la cadena de suministro.
- `npm audit --omit=dev` no reporta vulnerabilidades altas ni críticas. Mantiene una alerta moderada de PostCSS ([GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)) porque Next.js estable todavía incluye `postcss@8.4.31`. La aplicación no procesa CSS proporcionado por usuarios, que es la condición necesaria para el vector descrito.
- No ejecutar `npm audit fix --force`: actualmente propone una degradación incompatible de Next.js. Se debe actualizar cuando una versión estable de Next.js incluya PostCSS `8.5.10` o posterior y repetir la auditoría.
