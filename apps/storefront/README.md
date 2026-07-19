# Casa Atenta Tienda

Aplicación Next.js del ecommerce para `tienda.casa-atenta.com`. Durante el
desarrollo conserva un workspace independiente para aislar checkout, Auth y
cabeceras. El proyecto Vercel separado existente es **transitorio**: el objetivo
aprobado es integrar esta superficie en el build raíz y terminar con un único
proyecto Vercel para web, blog y tienda. Véase
[`SINGLE_PROJECT_ARCHITECTURE.md`](../../docs/ecommerce/SINGLE_PROJECT_ARCHITECTURE.md).

## Desarrollo

Desde la raíz del repositorio:

```bash
npm install
npm run store:dev
```

Validaciones:

```bash
npm run store:lint
npm run store:typecheck
npm run store:test
npm run store:build
npx --yes supabase@2.109.1 db reset --local
npx --yes supabase@2.109.1 test db
```

La tienda arranca en modo `preview`. En ese modo no indexa en buscadores y el
endpoint de checkout rechaza cualquier cobro. Para activar ventas deben estar en
`live` **ambas** variables:

```text
NEXT_PUBLIC_STORE_MODE=live
STORE_MODE=live
```

No deben activarse hasta completar la lista de
[`docs/ecommerce/LAUNCH_CHECKLIST.md`](../../docs/ecommerce/LAUNCH_CHECKLIST.md).

## Servicios

- Supabase: Postgres, Auth, Google OAuth, TOTP, RLS y almacenamiento de catálogo.
- Openpay Perú: tokenización en navegador, 3D Secure, antifraude y webhook con
  autenticación Basic.
- Cloudflare Turnstile: prueba de humanidad obligatoria antes de que el checkout
  cree el pedido, reserve stock y genere su evento inicial de outbox, y antes de
  reemitir un acceso invitado; usa acciones separadas y credenciales exclusivas
  de la tienda.
- Vercel: Preview transitorio con root `apps/storefront`; producción objetivo en
  el único proyecto raíz `casaatenta-web`, con routing por host.
- Resend: envía correos transaccionales desde la cola `store_outbox_events`.

La tarjeta se tokeniza en Openpay. El servidor no recibe ni almacena PAN o CVV.
Los webhooks se aplican mediante un RPC transaccional con una máquina de estados
monotónica; el importe y el intento deben coincidir. Si Openpay informa moneda,
debe ser PEN; si la omite, el RPC acepta el evento únicamente contra el intento
local autoritativo, que también debe ser PEN.

El endpoint `/api/cron/order-notifications` reclama y procesa la cola de
notificaciones. `/api/cron/order-reconciliation` consulta intentos Openpay antes
de liberar una reserva vencida. Ambos requieren Bearer `CRON_SECRET`; producción
debe invocar conciliación cada minuto y notificaciones como máximo cada cinco
minutos mediante Supabase Cron u otro
programador autenticado. Vercel Hobby Cron es diario y no sirve para este flujo.
Véase
[`ORDER_RECONCILIATION_RUNBOOK.md`](../../docs/ecommerce/ORDER_RECONCILIATION_RUNBOOK.md).

En el proyecto Vercel único, `SUPABASE_SECRET_KEY` y `RESEND_API_KEY` se definen
una sola vez para Casa Atenta. La tienda usa `STORE_RESEND_FROM_EMAIL` y
`STORE_NOTIFICATION_REPLY_TO` para no colisionar con el remitente corporativo.

El seguimiento de compra invitada usa un nonce revocable en base y una firma
HMAC en cookie HttpOnly. Requiere `STORE_GUEST_TRACKING_SECRET` exclusivo, de al
menos 32 bytes, solo en servidor; el token no se guarda en la outbox ni se
expone en las páginas de seguimiento.

La rotación de `STORE_GUEST_TRACKING_SECRET` invalida los accesos firmados con
la clave anterior. Antes de rotarla se pausa el consumidor —sin drenar los
eventos que aún deben generar enlaces—, se anuncia la ventana y se deja
operativo el flujo genérico de reemisión. Tras desplegar la clave nueva se
reanuda la outbox, que firmará los correos pendientes con ella; nunca se
reutiliza como `RATE_LIMIT_SECRET`, `CRON_SECRET` o credencial de otro proveedor.

## Datos comerciales

Todos los productos sembrados quedan con `commercial_status='pending'`, precio
nulo y stock cero. Para vender un SKU se requieren, como una sola aprobación:

1. modelo y configuración exacta del kit;
2. costo, precio final e IGV;
3. stock disponible;
4. garantía y red de servicio;
5. fotografías y documentos autorizados;
6. peso y dimensiones logísticas.

Solo después se asigna precio/stock y se cambia a `approved`. El RPC de checkout
vuelve a verificarlo bajo bloqueo de fila antes de reservar inventario.
