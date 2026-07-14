# Saneamiento de correo de Casa Atenta

Auditoría realizada el 13 de julio de 2026 para `casa-atenta.com`.

## Arquitectura objetivo

- Cloudflare será el DNS autoritativo y gestionará la recepción mediante Email Routing.
- Las cuatro identidades autorizadas se reenviarán a los dos destinos
  operativos mediante un Email Worker de Cloudflare.
- Resend enviará correos transaccionales y, en el futuro, el newsletter.
- Supabase conservará solicitudes, consentimientos, reclamos, suscriptores y eventos de entrega.
- Cloudflare Turnstile protegerá cada formulario antes de escribir o enviar correo.
- Namecheap no gestionará DNS ni correo. Si continúa siendo el registrador, solo conservará la renovación del dominio. Para eliminar también esa dependencia se debe transferir el registro a Cloudflare Registrar.

### Identidades y recepción

| Dirección de Casa Atenta | Uso de salida | Tratamiento de entrada |
| --- | --- | --- |
| `info@casa-atenta.com` | Atención y respuesta operativa | Email Worker → ambos destinos operativos verificados |
| `notificaciones@casa-atenta.com` | Automatizaciones de la web | Email Worker → ambos destinos; no se presenta como bandeja monitoreada |
| `febjon@casa-atenta.com` | Gerencia, solo bajo instrucción explícita | Email Worker → ambos destinos operativos |
| `aldonovar@casa-atenta.com` | Gerencia, solo bajo instrucción explícita | Email Worker → ambos destinos operativos |

Las cuatro reglas entrantes deben terminar en el Worker
`casa-atenta-email-router`. Este solo admite las cuatro direcciones literales y
reenvía cada mensaje a ambos destinos mediante `Promise.all`. No se debe usar
`info@casa-atenta.com` como destino de otra regla del propio dominio, porque
esa cadena puede crear un bucle. Las direcciones externas no se guardan en el
repositorio: viven como secretos cifrados del Worker.

`notificaciones@casa-atenta.com` es un remitente automático. Todas sus
plantillas indican que esa dirección no se monitorea y que cualquier contacto
debe dirigirse a `info@casa-atenta.com`. `febjon@casa-atenta.com` y
`aldonovar@casa-atenta.com` no pueden ser utilizados por formularios, tareas
programadas, webhooks ni newsletters; se reservan para envíos manuales de
gerencia solicitados expresamente.

## Estado público encontrado

- Nameservers activos: `fish.ns.cloudflare.com` y `jimmy.ns.cloudflare.com`.
- MX heredados: `eforward1` a `eforward5.registrar-servers.com`.
- SPF heredado: `v=spf1 include:spf.efwd.registrar-servers.com ~all`.
- DMARC Management está activo con una política inicial `p=none` y reportes agregados en Cloudflare.
- Resend verificó el dominio, DKIM y el Return-Path `send.casa-atenta.com`.
- No existe registro MTA-STS en `_mta-sts.casa-atenta.com`.
- No existe registro TLS-RPT en `_smtp._tls.casa-atenta.com`.
- No se encontró DS público; DNSSEC debe revisarse y activarse después de estabilizar la zona.
- El Worker `casa-atenta-email-router` ya está desplegado, sin endpoint
  `workers.dev`, con ambos destinos configurados como secretos.
- Cloudflare Email Routing aún está desactivado. Uno de los dos destinos ya
  está verificado y el segundo sigue pendiente; se reenvió su correo de
  verificación el 14 de julio de 2026.

No se deben eliminar los MX heredados hasta que el destino de Cloudflare Email Routing esté verificado. El cambio debe realizarse en una misma ventana para evitar pérdida de mensajes.

### Transferencia del registrador

- `casa-atenta.com` fue registrado el 16 de junio de 2026. Cloudflare lo marca como no transferible durante los primeros 60 días; se debe volver a comprobar a partir del 15 de agosto de 2026.
- El dominio quedó nuevamente bloqueado en Namecheap mientras vence ese plazo. No debe permanecer desbloqueado sin una transferencia activa.
- Cloudflare mostró un precio de `10,46 US$` antes de impuestos, con un año adicional de registro y renovación al mismo precio vigente. Cualquier cobro debe confirmarse nuevamente en la fecha de transferencia.
- En la fecha elegible: desbloquear, solicitar un Auth/EPP nuevo, volver a comprobar en Cloudflare y completar el pago. El Auth/EPP es confidencial y solo debe introducirse directamente en Cloudflare.
- Namecheap muestra un plan Private Email separado, con un buzón en uso y vigencia hasta el 18 de julio de 2027. Transferir el dominio no cancela automáticamente ese producto. No se debe cancelar ni cambiar los MX hasta validar el nuevo destino de recepción.

## 1. Cloudflare Email Routing

En Cloudflare: **Compute → Email Service → Email Routing**.

1. Completar la verificación de los dos destinos operativos. No activar la
   recepción mientras alguno continúe pendiente.
2. Activar Email Routing para `casa-atenta.com`.
3. Permitir que Cloudflare cree y bloquee sus registros administrados:
   - MX `@` hacia `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net` y `route3.mx.cloudflare.net`.
   - SPF único en `@`: `v=spf1 include:_spf.mx.cloudflare.net ~all`.
   - DKIM de enrutamiento con el selector entregado por Cloudflare.
4. Crear las reglas `info@casa-atenta.com`,
   `notificaciones@casa-atenta.com`, `febjon@casa-atenta.com` y
   `aldonovar@casa-atenta.com` hacia el Worker
   `casa-atenta-email-router`.
5. Crear `dmarc@casa-atenta.com` y `tls-reports@casa-atenta.com` hacia un buzón o servicio de reportes separado.
6. Mantener el catch-all desactivado o configurado para descartar. Esto evita recibir spam dirigido a direcciones inventadas.
7. Después de validar la recepción, retirar los cinco MX `eforward*` y el SPF de `spf.efwd.registrar-servers.com` si Cloudflare no los reemplazó automáticamente.

Debe existir un solo TXT que empiece por `v=spf1` en cada hostname. No se crearán registros SPF paralelos.

Cloudflare Email Routing reenvía mensajes; no es un buzón con carpetas. El filtrado final, las respuestas manuales y la cuarentena también dependen del proveedor de la dirección de destino.

Si una persona responde desde el Gmail de destino, el cliente verá ese Gmail.
Las respuestas de negocio deben enviarse desde una identidad autorizada
`@casa-atenta.com`; el reenvío entrante no convierte Gmail en un buzón de
salida corporativo.

## 2. Resend para salida

1. El dominio `casa-atenta.com` ya está verificado en Resend para enviar desde la región `sa-east-1`.
2. DKIM y el Return-Path `send` ya están verificados en Cloudflare como registros DNS.
3. No añadir un segundo SPF en `@`. Resend normalmente autentica el Return-Path en un subdominio; si el panel pidiera modificar el SPF raíz, se debe fusionar con el de Cloudflare en un único registro.
4. Configurar el remitente de la aplicación como `Casa Atenta <notificaciones@casa-atenta.com>` y `Reply-To: info@casa-atenta.com`. El pie compartido advierte, tanto en HTML como en texto plano, que `notificaciones@casa-atenta.com` es una dirección automática no monitoreada.
5. Después de publicar la nueva versión, crear un webhook en Resend hacia:

   `https://www.casa-atenta.com/api/webhooks/resend`

6. Suscribir al menos los eventos de entrega, rebote y queja. Copiar el Signing Secret en `RESEND_WEBHOOK_SECRET`.

La aplicación usa claves de idempotencia, verifica la firma Svix del webhook y suprime automáticamente del newsletter las direcciones con rebote permanente o queja de spam.

## 3. DMARC por etapas

Cloudflare DMARC Management publicó la etapa inicial de observación el 13 de julio de 2026:

```dns
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:9bd5c0ba3788471da92d93b215d45e45@dmarc-reports.cloudflare.net
TTL: Auto
```

Mantener `p=none` hasta observar que Cloudflare, Resend y cualquier otra fuente legítima pasan DMARC. Después:

1. `p=quarantine; pct=25` durante una semana.
2. Subir gradualmente a `pct=100`.
3. Pasar a `p=reject; pct=100` cuando no existan fuentes legítimas sin alinear.
4. Evaluar `adkim=s; aspf=s` solo después de estabilizar el envío.

No se debe publicar `p=reject` el primer día: podría bloquear fuentes legítimas todavía desconocidas.

## 4. MTA-STS y TLS-RPT

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

4. Publicar TLS-RPT:

```dns
Type: TXT
Name: _smtp._tls
Value: v=TLSRPTv1; rua=mailto:tls-reports@casa-atenta.com
TTL: Auto
```

5. Tras revisar reportes sin fallos, cambiar el archivo a `mode: enforce`, aumentar `max_age` y actualizar el valor `id` de `_mta-sts`.

## 5. Supabase

El proyecto gratuito `casa-atenta-production` está activo en la región
`sa-east-1`. La migración remota y el archivo local comparten la versión
`20260714030330`:
`supabase/migrations/20260714030330_email_forms_foundation.sql`.

1. La migración ya fue aplicada y las seis tablas remotas tienen RLS activo.
2. `anon` y `authenticated` no tienen permisos sobre estas tablas ni sobre la función de rate limiting; `service_role` conserva solo los permisos explícitos necesarios.
3. Los Database Advisors no reportan errores ni advertencias de seguridad. Los avisos informativos de RLS sin políticas son intencionales porque no existe acceso directo desde clientes.
4. Configurar una Secret key moderna `sb_secret_...` como `SUPABASE_SECRET_KEY`. `service_role` solo queda como compatibilidad temporal.
5. No exponer ninguna de estas claves con el prefijo `NEXT_PUBLIC_`.

Las tablas tienen RLS activo, no conceden acceso a `anon` ni `authenticated` y solo la capa de servidor recibe permisos explícitos.

La tarea programada aplica minimización de datos: elimina las huellas de contacto y reclamos a los 30 días, las huellas del historial de consentimiento a los 90 días, redacta destinatario y carga completa de webhooks a los 30 días y elimina su metadata a los 180 días. El historial de consentimiento conserva evento, versión y fecha.

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

Copiar los nombres de `.env.example` a Vercel o al proveedor de hosting. Los secretos reales no deben guardarse en el repositorio.

### Reintentos automáticos

`vercel.json` programa `/api/cron/email-retry` una vez al día a las 10:07 UTC
(05:07 de Lima), frecuencia compatible con el límite técnico de Vercel Hobby.
Configurar `CRON_SECRET` con al menos 32 caracteres en Vercel; la plataforma lo
enviará como Bearer token. La tarea reintenta hasta cinco veces las
notificaciones y recibos de contacto, las copias del Libro de Reclamaciones, la
confirmación de doble opt-in y la bienvenida del newsletter. Las claves
idempotentes son estables y también recuperan registros cuyo envío terminó,
pero cuyo estado no alcanzó a persistirse en Supabase.

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
- `CONTACT_INBOX`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES`
- `RATE_LIMIT_SECRET`
- `NEWSLETTER_TOKEN_SECRET`
- `NEXT_PUBLIC_SITE_URL`

`NEWSLETTER_TOKEN_SECRET` debe mantenerse estable: rotarlo invalida los enlaces de baja enviados anteriormente.

## 8. Verificación de salida

Después del despliegue:

1. Enviar pruebas a Gmail, Outlook y Yahoo.
2. Revisar encabezados: SPF, DKIM y DMARC deben mostrar `pass`.
3. Confirmar que el formulario se guarda en Supabase aunque Resend falle temporalmente.
4. Confirmar la recepción del webhook y su deduplicación.
5. Probar rebote con una dirección de prueba de Resend y verificar la supresión.
6. Verificar que un token Turnstile repetido sea rechazado.
7. Revisar semanalmente reportes DMARC, rebotes y quejas durante el primer mes.

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
