# Casa Atenta Tienda

Aplicación Next.js independiente para `tienda.casa-atenta.com`. Se despliega como
proyecto separado de la web corporativa para aislar checkout, autenticación,
cabeceras de seguridad y ciclos de publicación.

## Desarrollo

Desde la raíz del repositorio:

```bash
npm install
npm run store:dev
```

Validaciones:

```bash
npm run store:lint
npm --workspace @casa-atenta/storefront run typecheck
npm run store:build
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
- Vercel: proyecto con directorio raíz `apps/storefront` y dominio
  `tienda.casa-atenta.com`.
- Resend: envía correos transaccionales desde la cola `store_outbox_events`.

La tarjeta se tokeniza en Openpay. El servidor no recibe ni almacena PAN o CVV.
Los webhooks se aplican mediante un RPC transaccional con una máquina de estados
monotónica; el importe, moneda e intento de pago deben coincidir.

El endpoint `/api/cron/order-notifications` reclama y procesa la cola de
notificaciones. El `vercel.json` usa una ejecución diaria compatible con Vercel
Hobby, únicamente como red de seguridad. Antes de activar ventas se debe
configurar Vercel Pro (cada minuto) o un programador externo autenticado que lo
invoque cada 5 minutos como máximo; un correo de pago no debe esperar al ciclo
diario.

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
