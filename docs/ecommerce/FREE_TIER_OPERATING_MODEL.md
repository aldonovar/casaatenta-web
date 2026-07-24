# Operación en capas gratuitas: requisitos y límites

Revisión documental: 19 de julio de 2026. Los proveedores pueden cambiar sus
planes; se deben revisar sus paneles y términos de nuevo antes de activar
producción.

## Conclusión obligatoria

Es posible desarrollar, probar y mantener el ecommerce precomercial casi por
completo con capas gratuitas. No es correcto prometer una tienda comercial de
**costo total cero**:

- Vercel Hobby restringe el uso a proyectos personales/no comerciales;
- Openpay cobra por cada transacción procesada;
- dominio, emisión electrónica, asesoría legal/contable y operación logística
  pueden generar costes propios;
- una capa gratuita puede suspender, limitar o degradar el servicio al superar
  su cuota.

La regla económica es: un solo recurso por proveedor cuando sea técnicamente
seguro, medir cuotas y actualizar solo el componente que lo necesite. Nunca se
deben multiplicar proyectos para eludir límites.

## Inventario mínimo de cuentas y propiedad

| Servicio | Recurso definitivo | Titular/administración exigida |
| --- | --- | --- |
| GitHub | un repositorio privado `casaatenta-web` | organización o cuenta de Casa Atenta, 2FA y dos administradores recuperables |
| Vercel | un proyecto `casaatenta-web` | equipo Casa Atenta; dominio principal, `www`, `blog` y `tienda` en el mismo proyecto |
| Cloudflare | una zona `casa-atenta.com` | cuenta empresarial, 2FA, DNS exportable y cambios auditados |
| Supabase | un proyecto productivo Casa Atenta | organización separada de VANIA/ALLYX/personales; Auth, Postgres y Vault |
| Google Cloud | un cliente OAuth web | pantalla de consentimiento y propietarios de Casa Atenta |
| Openpay Perú | un comercio, con sandbox y producción separados | razón social/RUC aprobados; claves privadas solo en servidor |
| Resend | un dominio remitente verificado | DNS bajo Casa Atenta y API key limitada al envío necesario |
| CPE/PSE/OSE | una integración tributaria aprobada | credenciales empresariales, series, notas y conservación de XML/PDF/CDR |

Todos los accesos críticos requieren 2FA, correo de recuperación empresarial,
inventario de responsables y procedimiento de rotación. Las claves reales no se
guardan en Git, capturas, tickets ni documentación.

## Qué admite cada capa gratuita

### Vercel

Hobby incluye HTTPS, previews, dominios personalizados y recursos limitados,
pero es no comercial. El propio proveedor indica hasta 50 dominios por proyecto
y cron con frecuencia mínima diaria; una ejecución diaria no sirve para
reservas de inventario ni correos de pago. Referencias:
[Hobby](https://vercel.com/docs/plans/hobby),
[fair use](https://vercel.com/docs/limits/fair-use-guidelines) y
[límites de Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing).

Uso permitido en esta etapa: Preview protegido y pruebas sin cobros. Gate de
salida: actualizar el único proyecto a un plan que permita uso comercial, o
migrar el build único a un hosting cuyos términos sí lo permitan. No se abre un
segundo proyecto para evitar el gate.

### Supabase

Free permite dos proyectos por propietario/administrador y actualmente incluye,
entre otras cuotas, 500 MB de base por proyecto, 1 GB de Storage, 5 GB de egress
y 50 000 MAU. Una base que supera 500 MB entra en modo solo lectura. Los
proyectos con baja actividad pueden pausarse tras un periodo de siete días y
requieren atención del propietario para restaurarse. Referencias:
[cuotas](https://supabase.com/docs/guides/platform/billing-on-supabase),
[tamaño de base](https://supabase.com/docs/guides/platform/database-size) y
[pausa de proyectos Free](https://supabase.com/docs/guides/platform/free-project-pausing).

Requisitos para operar dentro de Free:

- guardar imágenes de catálogo optimizadas en el repositorio/CDN, no duplicarlas
  en Storage sin necesidad;
- política de retención para eventos, rate limits y outbox procesado;
- alerta al 60 %, 75 % y 90 % de base, Storage y egress;
- exportación cifrada y prueba periódica de restauración; no asumir que Free
  ofrece PITR o un SLA de producción;
- actividad y salud verificadas diariamente; una tienda no puede descubrir una
  pausa recién al recibir un pedido;
- un único proyecto productivo de Casa Atenta, separado de cuentas personales.

Supabase Cron con `pg_cron` y `pg_net` permite ejecutar la conciliación cada minuto
sin depender del cron diario de Vercel. La configuración está en
[ORDER_RECONCILIATION_RUNBOOK.md](./ORDER_RECONCILIATION_RUNBOOK.md).

### Cloudflare

El DNS autoritativo no cobra ni limita consultas en Free y Universal SSL emite
certificados para el dominio raíz y subdominios de primer nivel. Referencias:
[FAQ de DNS](https://developers.cloudflare.com/dns/faq/) y
[Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/).

Para el primer corte a Vercel se usa DNS-only. El proxy naranja se habilita solo
después de probar `Full (strict)`, webhooks, OAuth, cookies y bypass de caché en
`/api`, `/auth`, `/checkout`, `/cuenta` y `/seguimiento`.

### Resend

Free incluye actualmente 3 000 correos transaccionales al mes, máximo 100 por
día y 10 solicitudes por segundo compartidas por equipo. Cada destinatario
`To`/`CC`/`BCC` consume cuota. Referencias:
[precios](https://resend.com/docs/knowledge-base/what-is-resend-pricing) y
[cuotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits).

La outbox debe reintentar con backoff y dejar alertas; nunca se descarta un
evento porque se agotó la cuota. Umbral operativo: advertir al 60 % y bloquear
campañas no transaccionales al 75 %. Confirmación de pedido, pago, despacho,
restablecimiento de contraseña y reclamos tienen prioridad.

### Openpay

Sandbox permite pruebas, pero producción no es una capa gratuita: Openpay
publica comisión porcentual, IGV y, según modalidad, un cargo transaccional.
Consultar la tarifa contractual real del comercio en la
[página oficial de comisiones](https://www.openpay.pe/comisiones) antes de fijar
márgenes o publicar precios.

## Variables y secretos indispensables

Públicas, aptas para el navegador:

- URLs canónicas de web, blog y tienda;
- modo público `NEXT_PUBLIC_STORE_MODE`;
- contacto y domicilio legal aprobados;
- URL y publishable key de Supabase;
- Merchant ID y public key de Openpay sandbox/producción.

Solo servidor:

- `STORE_MODE`, Secret key de Supabase y private key de Openpay;
- credenciales Basic del webhook Openpay;
- `CRON_SECRET`, `RATE_LIMIT_SECRET` y
  `STORE_GUEST_TRACKING_SECRET`, distintos y aleatorios;
- API key/remitente de Resend;
- secret key de Cloudflare Turnstile; su site key sí es pública;
- secretos de Google OAuth y del proveedor CPE.

Cada secreto debe existir por entorno, tener dueño y fecha de rotación. Preview
nunca recibe claves productivas de Openpay. Cualquier valor con prefijo
`NEXT_PUBLIC_` debe considerarse público.

Turnstile es un gate obligatorio del checkout y de la reemisión de accesos
invitados, no un sustituto de los límites persistentes por IP/correo ni de la
conciliación. La allow-list debe contener exactamente
`tienda.casa-atenta.com` en producción; un token se acepta una sola vez y debe
corresponder a `store_checkout` o `store_guest_access` según el flujo.

## Umbrales de salida de la capa gratuita

Se escala antes de llegar al límite si ocurre cualquiera de estos hechos:

- se habilitan ventas: Vercel debe dejar Hobby por su restricción comercial;
- base o Storage Supabase supera 75 % de cuota durante dos semanas;
- la tienda necesita continuidad que Free no garantiza o backups/PITR formales;
- Resend supera 75 correos/día de forma sostenida o una notificación crítica
  queda retrasada;
- la función de conciliación rebasa su ventana o acumula reservas pendientes;
- el volumen de imágenes, transferencias o funciones se aproxima al 75 %;
- un requisito legal, tributario o contractual exige SLA, soporte o retención
  no incluidos.
