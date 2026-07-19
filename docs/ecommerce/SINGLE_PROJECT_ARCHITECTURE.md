# Arquitectura objetivo: un solo proyecto Vercel

Estado de decisión: **aprobado como objetivo técnico**. Casa Atenta debe terminar
con un único proyecto Vercel de producción para la web, el blog y la tienda. No
se crearán más proyectos por subdominio.

Esta decisión reduce despliegues, variables, dominios y puntos de fallo, pero no
significa que se puedan apuntar hoy los tres hosts al build raíz sin integrar el
código. En el repositorio todavía existen dos aplicaciones Next.js: la web en la
raíz y `apps/storefront`. Vercel solo debe recibir **un build Next.js final** con
todas las superficies.

## Topología definitiva

| Host público | Superficie | Ruta interna del build único |
| --- | --- | --- |
| `casa-atenta.com` / `www.casa-atenta.com` | Web corporativa | rutas principales |
| `blog.casa-atenta.com` | Blog | `/blog/*` |
| `tienda.casa-atenta.com` | Ecommerce | `/storefront/*` |

La ruta interna no forma parte de la URL pública. El `proxy.ts` del build raíz
debe resolver el host normalizado desde `x-forwarded-host`/`host` y reescribir:

```text
blog.casa-atenta.com/ruta   -> /blog/ruta
tienda.casa-atenta.com/ruta -> /storefront/ruta
```

La web principal debe redirigir cualquier acceso público a `/blog/*` o
`/storefront/*` hacia su host canónico. La resolución por host también debe
cubrir APIs de tienda, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`,
callbacks Auth y respuestas de error. No basta con reescribir solo páginas HTML.

## Límites entre superficies dentro del mismo build

Un proyecto único no autoriza a mezclar responsabilidades. Deben mantenerse:

- layouts raíz y estilos aislados para marketing/blog y tienda;
- APIs comerciales bajo un namespace interno propio;
- activos de producto con prefijo estable, por ejemplo `/store-assets/*`, para
  evitar colisiones con archivos públicos de la web;
- cookies de tienda con el alcance mínimo necesario y sin compartir tokens con
  el blog;
- CSP, `Cache-Control`, `Referrer-Policy`, canonical, sitemap y robots correctos
  para cada host;
- secretos solo de servidor y una sola matriz de variables por entorno;
- migraciones Supabase ordenadas desde este repositorio, RLS y privilegios por
  tabla/RPC, aunque la base sea compartida.

El proyecto Vercel definitivo será `casaatenta-web`, con `Root Directory = .`,
un solo comando de instalación, un solo build y una sola rama de producción.
Los cuatro dominios se asociarán al mismo proyecto:

- `casa-atenta.com`;
- `www.casa-atenta.com`;
- `blog.casa-atenta.com`;
- `tienda.casa-atenta.com`.

## Estado transitorio actual

Al 15 de julio de 2026 se había creado `casaatenta-storefront` con
`Root Directory = apps/storefront` para obtener un Preview aislado y
fail-closed. Ese proyecto es **transitorio**, no la arquitectura final. Debe
conservarse únicamente como referencia/rollback mientras se integra y verifica
el build único. No se le deben añadir cobros reales ni usarlo como segundo
sistema operativo permanente.

Además, `tienda.casa-atenta.com` seguía en NXDOMAIN y la tienda permanecía con
`NEXT_PUBLIC_STORE_MODE=preview` y `STORE_MODE=preview`. Antes de cualquier
cambio de DNS hay que volver a verificar el estado vivo de Cloudflare, Vercel y
sus aliases; los IDs históricos de deployment no deben tratarse como actuales.

## Un solo proyecto Supabase de Casa Atenta

La producción debe usar un proyecto Supabase propiedad de Casa Atenta para:

- Auth, Google OAuth, TOTP y sesiones SSR;
- perfiles, direcciones y consentimientos versionados;
- catálogo, SKUs, inventario, pedidos, pagos, envíos y eventos;
- Libro de Reclamaciones y solicitudes de privacidad;
- outbox transaccional, reconciliación y auditoría.

Compartir una instancia no significa conceder acceso cruzado. RLS queda activa
en toda tabla expuesta, las operaciones administrativas usan una Secret key
solo en servidor y los RPC comerciales revocan `anon`/`authenticated` cuando
corresponde. El entorno local de Supabase sirve para migraciones y pruebas; no
se improvisará un segundo proyecto productivo para otro subdominio.

### Modelo comercial que debe conservarse

- `store_products` y `product_variants` mantienen SKU único, importes en
  centavos PEN, estado editorial, aprobación comercial y stock no negativo;
- un SKU solo se vende con `status=active`, `commercial_status=approved`, precio,
  stock, peso, envío, garantía y contenido del kit verificados;
- `store_orders`, items y direcciones guardan snapshots de la compra para que un
  cambio posterior del catálogo no altere el comprobante histórico;
- pedido, pago, fulfilment y envío usan estados separados; ningún cambio visual
  del frontend sustituye la transición transaccional de base;
- `store_order_events` forma la línea pública del pedido y `store_shipments`
  guarda transportista/tracking; la vista invitada devuelve solo una proyección
  aprobada, nunca email, documento, teléfono o domicilio;
- la outbox transaccional desacopla correos de la confirmación del pedido; todo
  consumidor debe ser idempotente y reintentable;
- conciliación y webhooks comparten el mismo orden de locks y nunca liberan
  inventario por un simple timeout de red.

## Plan de consolidación sin interrupción

### Fase 1 — integrar sin publicar

1. Crear la superficie interna de tienda en la aplicación raíz y portar rutas,
   layouts, APIs, metadatos, estilos y activos sin cambiar el dominio público.
2. Extender el proxy por host con una allow-list exacta y pruebas contra hosts
   desconocidos, `blog.localhost` y `tienda.localhost`.
3. Consolidar dependencias, scripts y variables; el build raíz debe incluir
   marketing, blog y tienda en una sola ejecución.
4. Mantener ambos modos de tienda en `preview`; checkout debe responder 503.

### Fase 2 — demostrar el build único

El Preview del proyecto `casaatenta-web` debe pasar:

- lint, typecheck, pruebas unitarias, migraciones y build;
- navegación móvil/desktop y teclado de las tres superficies;
- rutas, APIs y activos con cabeceras `Host` de cada dominio;
- Auth completo, cookies, RLS, callback de Google y TOTP;
- catálogo, carrito, checkout bloqueado, seguimiento invitado y legales;
- canonical, robots, sitemap, CSP, HSTS y caché privada;
- webhooks Openpay y crons autenticados sin registrar PII o secretos.

### Fase 3 — mover el dominio con rollback

1. Asociar `tienda.casa-atenta.com` al proyecto `casaatenta-web` y copiar el
   destino DNS exacto que Vercel muestre para ese proyecto.
2. En Cloudflare crear/actualizar solo el CNAME `tienda`, inicialmente
   **DNS-only**, TTL Auto. No modificar apex, `www` ni `blog`.
3. Esperar verificación del dominio y certificado TLS antes de la primera
   respuesta, porque el dominio raíz ya publica HSTS con `includeSubDomains`.
4. Mantener `preview`, comprobar DNS, TLS y todos los hosts públicamente.
5. Conservar el proyecto transitorio durante la ventana de observación. Si
   falla, devolver únicamente el CNAME/alias `tienda` al deployment anterior.
6. Tras la aceptación formal, retirar el dominio del proyecto transitorio y
   eliminar ese proyecto. El estado final debe mostrar un único proyecto Vercel.

## Criterio de activación comercial

La consolidación técnica y la activación de ventas son gates distintos. Aunque
el host ya responda, la tienda continúa fail-closed hasta completar
[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md). El cambio a `live` exige aprobar
catálogo, stock, comprobantes, logística, legales, pagos, reconciliación,
notificaciones, backups y respuesta a incidentes.

La capa Hobby gratuita de Vercel es únicamente para uso personal/no comercial;
sus términos prohíben usarla para solicitar o procesar pagos. Por ello, el build
único puede permanecer gratis durante desarrollo y Preview, pero **no puede
abrir ventas en Vercel Hobby**. La consolidación evita duplicidad de proyectos y
costes operativos; no elimina esta obligación contractual. Véanse el
[plan Hobby](https://vercel.com/docs/plans/hobby) y las
[reglas de uso comercial](https://vercel.com/docs/limits/fair-use-guidelines).
