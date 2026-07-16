# Despliegue de `tienda.casa-atenta.com`

Estado verificado el 15 de julio de 2026. La tienda debe permanecer con
`NEXT_PUBLIC_STORE_MODE=preview` y `STORE_MODE=preview` hasta cerrar todos los
bloqueadores del checklist de lanzamiento.

## Separación obligatoria

| Host | Aplicación | Proyecto Vercel |
| --- | --- | --- |
| `casa-atenta.com` / `www.casa-atenta.com` | Web principal | `casaatenta-web` |
| `blog.casa-atenta.com` | Blog servido por la web principal | `casaatenta-web` |
| `tienda.casa-atenta.com` | `apps/storefront` | Proyecto separado `casaatenta-storefront` |

No se debe añadir `tienda` al proyecto Vercel actual: ese proyecto compila la
raíz y serviría la web principal, no el storefront.

## Estado verificado

- Vercel ya tiene el proyecto separado `casaatenta-storefront`
  (`prj_ddxHyW45OiPPIeNyPNzs4OMrfh1g`), conectado a
  `aldonovar/casaatenta-web` con `main` como rama de producción.
- La configuración efectiva es `Root Directory = apps/storefront`, Next.js,
  Node.js 22 y `Install Command = cd ../.. && npm ci --include=dev`. El comando
  de instalación desde la raíz es necesario porque el PostCSS compartido usa
  dependencias de desarrollo del workspace.
- La rama `codex/storefront-readiness`, commit
  `40246e1245e211090cd357f09a2c1c98499c6276`, tiene un Preview `READY` y
  protegido por Vercel:
  `https://casaatenta-storefront-q0usyhopw-allyx.vercel.app`
  (`dpl_FzssvmZ7mmDQTcctQmqnVRJnv7ZB`).
- El Preview tiene solamente las variables no sensibles de modo, URL de tienda
  y URL de marketing. No tiene credenciales de Supabase ni Openpay.
- La validación remota devolvió 200 para portada, términos de compra, ficha de
  producto e imagen WebP. También confirmó `X-Robots-Tag: noindex`,
  `robots.txt` con `Disallow: /`, canonical hacia `tienda.casa-atenta.com` y
  checkout bloqueado con 503.
- El primer intento de build quedó en `ERROR` sin alias asignado ni dominio y no
  está sirviendo tráfico. No debe promoverse.
- El proyecto solo tiene asociado su dominio predeterminado
  `casaatenta-storefront.vercel.app`; `tienda.casa-atenta.com` continúa sin
  asociarse.
- Cloudflare no tiene registro `tienda`; públicamente el host continúa en
  NXDOMAIN. No se modificaron apex, `www` ni `blog`.
- La consulta de configuración, todavía de solo lectura, recomienda como CNAME
  primario `64595190c9c57126.vercel-dns-017.com.`. Debe volver a consultarse
  después de asociar el dominio al proyecto y antes de crear el registro DNS.
- Apex, `www` y `blog` usan CNAME DNS-only hacia Vercel. El blog recibe TLS de
  Vercel/Let's Encrypt. La web principal ya publica HSTS con
  `includeSubDomains`, de modo que `tienda` necesita HTTPS válido desde su
  primera respuesta.
- La zona tiene Universal SSL, pero no se observó un registro DS público para
  completar DNSSEC.

## Secuencia segura de publicación

1. Crear `casaatenta-storefront` en el mismo equipo Vercel. **Completado.**
2. Conectar el repositorio `aldonovar/casaatenta-web`, rama `main`.
   **Completado.**
3. Configurar `Root Directory = apps/storefront`, framework Next.js, Node.js 22
   e instalación desde la raíz del workspace. **Completado.**
4. Cargar únicamente variables de preview. No cargar credenciales de producción
   de Openpay hasta terminar la compra de staging.
   **Completado para las variables no sensibles.**
5. Validar la URL `vercel.app`: catálogo, imágenes, legales, carrito, headers y
   bloqueo de cobros. **Completado para el Preview actual.**
6. Agregar `tienda.casa-atenta.com` al proyecto nuevo y copiar el destino CNAME
   exacto que indique Vercel.
7. Crear en Cloudflare un solo CNAME:
   - nombre: `tienda`;
   - destino: valor indicado por Vercel;
   - proxy: DNS-only;
   - TTL: Auto.
8. Esperar hasta que Vercel muestre el dominio verificado, alias sin error y
   certificado activo.
9. Verificar DNS, TLS, HSTS, canonical, `robots.txt` y rutas críticas.
10. Configurar Supabase hospedado y ejecutar pruebas Auth/RLS. Solo después se
    evalúa una activación comercial controlada.

No reutilizar a ciegas el CNAME actual del blog: Vercel debe proporcionar el
valor específico del nuevo proyecto. Referencia: [dominios personalizados de
Vercel](https://vercel.com/docs/domains/set-up-custom-domain).

## Variables

Públicas:

- `NEXT_PUBLIC_STORE_URL=https://tienda.casa-atenta.com`
- `NEXT_PUBLIC_MARKETING_URL=https://www.casa-atenta.com`
- `NEXT_PUBLIC_STORE_MODE=preview`
- `NEXT_PUBLIC_STORE_PHONE`
- `NEXT_PUBLIC_STORE_EMAIL`
- `NEXT_PUBLIC_STORE_WHATSAPP`
- `NEXT_PUBLIC_STORE_DELIVERY_WINDOW`
- `NEXT_PUBLIC_LEGAL_ADDRESS`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_OPENPAY_MERCHANT_ID`
- `NEXT_PUBLIC_OPENPAY_PUBLIC_KEY`
- `NEXT_PUBLIC_OPENPAY_ENVIRONMENT=sandbox`

Solo servidor:

- `STORE_MODE=preview`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `OPENPAY_MERCHANT_ID`
- `OPENPAY_PRIVATE_KEY`
- `OPENPAY_ENVIRONMENT=sandbox`
- `OPENPAY_USE_3DS=true`
- `OPENPAY_WEBHOOK_USERNAME`
- `OPENPAY_WEBHOOK_PASSWORD`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `STORE_NOTIFICATION_REPLY_TO`
- `CRON_SECRET`
- `RATE_LIMIT_SECRET`

El build falla intencionalmente en modo `live` si falta una URL o dato legal de
contacto público. Las claves secretas nunca llevan prefijo `NEXT_PUBLIC_`.

## Verificación posterior

- `https://tienda.casa-atenta.com/`
- `/catalogo` y las 18 rutas de producto
- `/legal/privacidad`, `/legal/terminos-de-compra`,
  `/legal/envios-cambios-y-garantias`, `/legal/cookies`
- `/libro-de-reclamaciones`
- `/auth/ingresar`, callback, Magic Link, recuperación, Google y TOTP
- `/checkout` bloqueado en preview
- `/robots.txt` con `Disallow: /` mientras sea preview
- CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` y no-store de Auth

## Rollback

Si el alias o certificado falla, eliminar únicamente el CNAME `tienda` y el
dominio del proyecto storefront. No modificar los registros de apex, `www` ni
`blog`. Mantener el último despliegue READY y no promover una versión que haya
fallado Auth, checkout o migraciones.

Cloudflare con proxy naranja se evalúa después, no durante el primer lanzamiento.
Requiere `Full (strict)`, bypass de caché para `/api`, `/auth`, `/checkout` y
`/cuenta`, además de pruebas completas de OAuth, cookies, Openpay y webhooks.
