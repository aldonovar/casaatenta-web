# Despliegue de `tienda.casa-atenta.com`

> **Decisión vigente:** el estado final será **un solo proyecto Vercel** para
> web, blog y tienda. La antigua indicación de mantener un proyecto storefront
> separado queda reemplazada por
> [SINGLE_PROJECT_ARCHITECTURE.md](./SINGLE_PROJECT_ARCHITECTURE.md).

## Estado conocido y alcance

La última verificación externa registrada fue el 15 de julio de 2026. En ese
momento:

- la web principal y `blog.casa-atenta.com` usaban `casaatenta-web`;
- existía el proyecto transitorio `casaatenta-storefront`, conectado a
  `apps/storefront`, con un Preview protegido y fail-closed;
- `tienda.casa-atenta.com` estaba asociado al proyecto transitorio, pero el host
  público seguía en NXDOMAIN porque Cloudflare no tenía el CNAME;
- Vercel no podía terminar el certificado/alias mientras el DNS no resolviera;
- el storefront bloqueaba checkout y publicaba `noindex, nofollow` en preview;
- no se habían cargado credenciales productivas de Supabase u Openpay;
- la autoasignación de custom domains del proyecto temporal estaba desactivada.

Este inventario es histórico: antes de tocar dominios o aliases hay que volver a
consultar Vercel, Cloudflare y DNS público. No se debe apuntar `tienda` a un ID de
deployment o CNAME copiado de esta documentación.

## Estado permitido durante la consolidación

- `NEXT_PUBLIC_STORE_MODE=preview`
- `STORE_MODE=preview`
- checkout HTTP 503, sin tokenización/cobro productivo
- `robots.txt` con `Disallow: /` y `X-Robots-Tag: noindex, nofollow`
- credenciales Openpay sandbox únicamente
- proyecto `casaatenta-storefront` usado solo como Preview/rollback transitorio
- ningún proyecto Vercel adicional

El host no se publica todavía. Primero se integra el storefront dentro del build
raíz, se valida el proyecto único y se cierran los gates de lanzamiento.

## Proyecto Vercel definitivo

| Propiedad | Valor objetivo |
| --- | --- |
| Proyecto | `casaatenta-web` |
| Repositorio | `aldonovar/casaatenta-web` |
| Rama de producción | `main` |
| Root Directory | `.` |
| Aplicación | un único build Next.js con routing por host |
| Dominios | apex, `www`, `blog` y `tienda` |
| Node | versión soportada y fijada por el repositorio/proyecto |

No se cambia `Root Directory` a `apps/storefront` en el proyecto definitivo. El
código de la tienda debe integrarse primero según
[SINGLE_PROJECT_ARCHITECTURE.md](./SINGLE_PROJECT_ARCHITECTURE.md).

## Secuencia segura de publicación

1. Integrar web, blog y tienda en un solo build raíz y una sola matriz de
   variables.
2. Validar Preview de `casaatenta-web`: build, host routing, activos, Auth,
   legales, checkout bloqueado, tracking invitado, headers y APIs.
3. Aplicar migraciones en staging y validar RLS/roles/RPCs.
4. Configurar las tareas autenticadas según
   [ORDER_RECONCILIATION_RUNBOOK.md](./ORDER_RECONCILIATION_RUNBOOK.md), aún
   inactivas.
5. Cerrar el [checklist de lanzamiento](./LAUNCH_CHECKLIST.md), excepto la
   activación `live`.
6. Confirmar que el plan del proyecto permite uso comercial. Vercel Hobby no lo
   permite; consolidar proyectos no elimina este gate. Revisar también
   [FREE_TIER_OPERATING_MODEL.md](./FREE_TIER_OPERATING_MODEL.md).
7. Asociar `tienda.casa-atenta.com` al proyecto `casaatenta-web` y copiar el
   destino exacto indicado por Vercel.
8. En Cloudflare crear/actualizar un solo CNAME `tienda`, inicialmente DNS-only,
   TTL Auto. No modificar apex, `www` ni `blog`.
9. Esperar dominio verificado y TLS válido; después probar DNS, HSTS, canonical,
   robots, APIs, callback Auth, cookies, webhook y crons.
10. Mantener el modo `preview` durante la ventana de observación.
11. Ejecutar una compra controlada en staging y obtener aprobación formal.
12. Activar producción cambiando juntas las dos variables de modo.
13. Tras la aceptación, retirar el dominio y eliminar
    `casaatenta-storefront`. Confirmar visualmente que queda un único proyecto.

Vercel documenta la asociación de dominios en
[Set up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain).

## Variables

Públicas:

- `NEXT_PUBLIC_SITE_URL=https://www.casa-atenta.com`
- `NEXT_PUBLIC_BLOG_URL=https://blog.casa-atenta.com`
- `NEXT_PUBLIC_STORE_URL=https://tienda.casa-atenta.com`
- `NEXT_PUBLIC_MARKETING_URL=https://www.casa-atenta.com`
- `NEXT_PUBLIC_STORE_MODE=preview`
- contacto, entrega y domicilio legal aprobados
- URL/publishable key de Supabase
- Merchant ID/public key/entorno de Openpay

Solo servidor:

- `STORE_MODE=preview`
- `SUPABASE_URL` y `SUPABASE_SECRET_KEY`
- `OPENPAY_MERCHANT_ID`, `OPENPAY_PRIVATE_KEY`, entorno y 3DS
- usuario/contraseña del webhook Openpay
- `RESEND_API_KEY`, `STORE_RESEND_FROM_EMAIL` y `STORE_NOTIFICATION_REPLY_TO`
- `CRON_SECRET`, `RATE_LIMIT_SECRET` y `STORE_GUEST_TRACKING_SECRET`

Los secretos deben ser distintos, aleatorios y configurados por entorno. Una
Secret key nunca usa `NEXT_PUBLIC_`. Preview no recibe credenciales productivas
de Openpay.

## Verificación posterior al DNS

- los cuatro hosts responden desde el mismo deployment de `casaatenta-web`;
- apex/`www` no sirven rutas internas de blog/tienda;
- `blog` conserva URLs limpias, feed, sitemap e imágenes sociales;
- `tienda` sirve portada, catálogo, productos, carrito y legales;
- `/seguimiento`, `/auth`, `/cuenta`, `/checkout` y APIs privadas no se cachean;
- callback Google, Magic Link, recuperación, TOTP y cookies funcionan;
- webhook Openpay acepta solo Basic Auth correcto e idempotencia;
- cron de conciliación devuelve 200 sin errores y no sigue redirects;
- CSP, HSTS, `nosniff`, Referrer Policy, canonical y robots son correctos;
- no aparecen PAN, CVV, tokens, direcciones o secretos en logs.

## Rollback

Durante la ventana de transición, si el build único falla:

1. volver únicamente el CNAME/alias `tienda` al Preview transitorio verificado;
2. mantener `preview`, sin cobros;
3. no modificar apex, `www` ni `blog`;
4. desactivar crons si el endpoint correcto deja de responder;
5. corregir y repetir la validación completa antes de otro corte.

Una vez eliminado el proyecto transitorio, el rollback normal es promover el
último deployment READY del proyecto único. Nunca se promueve un deployment con
migraciones, Auth, checkout o reconciliación fallidos.

El proxy naranja de Cloudflare se evalúa después del corte, con `Full (strict)`
y reglas explícitas de no-cache para rutas dinámicas y privadas.
