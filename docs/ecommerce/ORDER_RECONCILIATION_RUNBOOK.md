# Runbook de conciliación de reservas y Openpay

Este proceso evita que una caída, timeout o respuesta ambigua de Openpay deje
stock reservado para siempre, y evita el error contrario: liberar stock de un
pago que sí fue aceptado. **Nunca se libera inventario únicamente porque la
petición HTTP de checkout falló o agotó su tiempo.**

## Flujo implementado

La migración `20260719054500_commerce_integrity_v1.sql` añade una reserva de
45 minutos y RPCs de trabajo seguro. El endpoint autenticado es:

```text
POST /api/cron/order-reconciliation
Authorization: Bearer <CRON_SECRET>
```

En cada ejecución:

1. `claim_expired_store_reservations(2)` toma hasta dos reservas vencidas con
   `FOR UPDATE SKIP LOCKED`; cada claim devuelve el pago exacto y un lease UUID.
   El lote cabe en los 55 s de `pg_net` aun si dos consultas Openpay alcanzan
   sus timeouts de 20 s.
2. Consulta Openpay por el `order_id` usado en el intento de pago.
3. Si Openpay confirma/rechaza, `ingest_and_apply_openpay_event` persiste el
   evento idempotente y aplica la máquina de estados en una sola transacción.
4. Si aún no existe cargo, difiere una primera vez. Solo desde una segunda
   conciliación vacía puede cancelar y devolver stock.
5. Estados ambiguos, payloads inesperados, varios cargos, 20 intentos o pedidos mayores de 24 horas
   pasan a `needs_review`; no se liberan automáticamente.

Openpay puede agregar campos/valores y reintenta una notificación hasta recibir
éxito. Por ello, payloads futuros o un intento local aún no conciliado se
persisten de forma idempotente y se responden con HTTP 200 después de quedar
durables; la recuperación pertenece a este reconciliador, no al bucle de
delivery. El ejemplo oficial de `charge.succeeded` puede omitir `currency`: en
ese caso el RPC exige que el pago local autoritativo sea PEN. Véanse las
[notificaciones oficiales de Openpay](https://documents.openpay.pe/documentacion/notificaciones).

La respuesta válida contiene contadores:

```json
{
  "claimed": 0,
  "confirmed": 0,
  "rejected": 0,
  "expired": 0,
  "waiting": 0,
  "review": 0,
  "errors": 0
}
```

## Prerrequisitos

- migraciones aplicadas en staging y producción en orden;
- `tienda.casa-atenta.com` con DNS y TLS válidos, sin redirección del endpoint;
- `CRON_SECRET` aleatorio de 32 bytes o más en el entorno Production de Vercel;
- el mismo valor guardado cifrado en Supabase Vault;
- `OPENPAY_MERCHANT_ID`, `OPENPAY_PRIVATE_KEY` y entorno correctos en Vercel;
- extensiones `pg_cron`, `pg_net` y Vault habilitadas en Supabase;
- una prueba manual sandbox que cubra aprobado, rechazado, pendiente, timeout y
  webhook retrasado;
- las 74 aserciones de `supabase/tests/commerce_integrity_v1.sql` ejecutadas
  sobre un `db reset` limpio;
- la función Vercel debe honrar `maxDuration=60`; confirmar en el deployment que
  su plan/configuración permite al menos 60 segundos y activar Fluid Compute si
  fuese necesario;
- alerta y responsable para filas `needs_review`.

No programe el job contra un Preview protegido ni contra un host NXDOMAIN. No
guarde `CRON_SECRET` en una migración, query pegada en tickets o `vercel.json`.

## Programación recomendada en Supabase Cron

Supabase documenta que Cron usa `pg_cron` y puede invocar HTTP con `pg_net`; el
Dashboard conserva historial de ejecuciones. Véanse
[Supabase Cron](https://supabase.com/docs/guides/cron),
[Quickstart](https://supabase.com/docs/guides/cron/quickstart),
[pg_net](https://supabase.com/docs/guides/database/extensions/pg_net) y
[Vault](https://supabase.com/docs/guides/database/vault).

1. En **Integrations -> Cron**, habilitar Cron/`pg_cron`.
2. Habilitar `pg_net` y Vault.
3. Crear en Vault los secretos; sustituir los marcadores localmente y no
   conservarlos en el historial compartido:

```sql
select vault.create_secret(
  'https://tienda.casa-atenta.com',
  'casa_atenta_store_url',
  'Host canónico de la tienda para jobs'
);

select vault.create_secret(
  'REPLACE_WITH_THE_SAME_VERCEL_CRON_SECRET',
  'casa_atenta_store_cron_secret',
  'Bearer para endpoints cron de la tienda'
);
```

4. Programar conciliación cada minuto. Con un lote máximo de dos, la capacidad
   nominal es 120 reservas/hora sin superponer llamadas lentas dentro de una
   misma función:

```sql
select cron.schedule(
  'casa-atenta-order-reconciliation-v1',
  '* * * * *',
  $job$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'casa_atenta_store_url'
      ) || '/api/cron/order-reconciliation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'casa_atenta_store_cron_secret'
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 55000
    ) as request_id;
  $job$
);
```

Los nombres de jobs distinguen mayúsculas/minúsculas y crear el mismo nombre
reemplaza el anterior. Verifique la firma efectiva de `net.http_post` en el
proyecto antes de ejecutar el SQL, porque la versión de la extensión puede
cambiar. Si el Dashboard ofrece el tipo **HTTP request**, se puede configurar el
mismo POST allí y seleccionar el secreto desde Vault.

El procesador de correos `/api/cron/order-notifications` debe ejecutarse cada
cinco minutos como máximo. No
se usa Vercel Hobby Cron como scheduler primario: su frecuencia mínima es diaria
y no garantiza el minuto exacto.

## Activación y prueba

Antes de activar el job, probar una vez desde un terminal seguro:

```bash
curl --request POST \
  --header 'Authorization: Bearer REPLACE_LOCALLY' \
  --header 'Content-Type: application/json' \
  https://tienda.casa-atenta.com/api/cron/order-reconciliation
```

Resultado esperado: HTTP 200 y `errors: 0`. Luego active el job y compruebe dos
ciclos consecutivos.

Consultas operativas:

```sql
select jobid, jobname, schedule, active
from cron.job
where jobname = 'casa-atenta-order-reconciliation-v1';

select status, return_message, start_time, end_time
from cron.job_run_details
where jobid = (
  select jobid from cron.job
  where jobname = 'casa-atenta-order-reconciliation-v1'
)
order by start_time desc
limit 20;

select id, status_code, timed_out, error_msg, created
from net._http_response
order by created desc
limit 20;

select reservation_reconcile_state, count(*)
from public.store_orders
where inventory_reserved
group by reservation_reconcile_state
order by reservation_reconcile_state;

select id, order_number, reservation_reconcile_attempts,
       reservation_reconcile_error, reservation_expires_at
from public.store_orders
where reservation_reconcile_state = 'needs_review'
order by created_at;

select id, aggregate_id, topic, attempts, max_attempts, available_at,
       left(last_error, 160) as last_error
from public.store_outbox_events
where processed_at is null
  and (attempts >= max_attempts or available_at < now() - interval '15 minutes')
order by available_at;

select order_id, payment_id, resolution, provider_reference, actor,
       reason, created_at
from public.store_payment_review_audits
order by created_at desc
limit 50;
```

`cron.job_run_details` solo confirma que el SQL del job encoló la solicitud de
`pg_net`; no demuestra que el endpoint respondió HTTP 200. Correlacione el
`request_id` con `net._http_response` y conserve además una auditoría durable o
una alerta externa, porque esa tabla de respuestas es temporal.

Durante las primeras 24 horas de staging y de producción, revisar cada ciclo.
Después, revisar al menos diariamente y alertar inmediatamente ante:

- HTTP distinto de 200 o `errors > 0`;
- `needs_review > 0`;
- una reserva vencida sin claim por más de diez minutos;
- divergencia entre estado Openpay, pago, pedido e inventario;
- ausencia de ejecuciones durante más de diez minutos.

## Diagnóstico

| Síntoma | Acción |
| --- | --- |
| 401 | comparar/rotar `CRON_SECRET` en Vercel y Vault; nunca imprimirlo |
| 404 o 308 | corregir host routing; el job no debe depender de seguir redirects |
| 503 al reclamar | confirmar migración, URL/Secret key de Supabase y logs de función |
| `errors > 0` | revisar credenciales/entorno Openpay y `store_reconciliation_item_error` |
| `waiting` sostenido | consultar el intento en Openpay y revisar latencia/webhooks |
| `review > 0` | congelar despacho/reembolso automático y conciliar manualmente |
| cron sin historial | verificar job activo, extensiones y `cron.job_run_details` |
| job `succeeded` pero sin resultado comercial | comprobar `net._http_response`, HTTP 200 y auditoría durable del endpoint |

Las respuestas recientes de `pg_net` se pueden inspeccionar desde el Dashboard
o en `net._http_response`; son evidencia temporal, no un sistema permanente de
logs.

## Revisión manual y rollback

Ante un pedido en `needs_review`:

1. identificar pedido, intento, importe y moneda sin copiar PII a tickets;
2. consultar el cargo en el panel/API de Openpay y los webhooks persistidos;
3. comparar UUID del intento, external ID, importe y moneda;
4. si se confirma pago, aplicar el evento por el flujo transaccional existente;
5. usar exclusivamente `resolve_store_order_payment_review` con resolución
   `confirm_paid` o `cancel_no_charge`, referencia del proveedor, actor y motivo;
   nunca actualizar stock/pedido/pago con sentencias sueltas;
6. registrar actor, evidencia, hora y decisión.

Ejemplo de forma (reemplace valores solo en una consola operativa auditada):

```sql
select public.resolve_store_order_payment_review(
  'ORDER_UUID',
  'PAYMENT_UUID',
  'cancel_no_charge',
  'OPENPAY_CASE_REFERENCE',
  'operator@example.com',
  'Openpay confirmó documentalmente que no existe cargo para este intento.'
);
```

La función conserva `processing`, `ready_to_ship`, `shipped` o `delivered` si
el pedido ya estaba pagado, y no vuelve a descontar inventario.

Para detener el job sin alterar pedidos:

```sql
select cron.unschedule('casa-atenta-order-reconciliation-v1');
```

Detener el scheduler no libera stock. Si se rota el secreto: desactivar job,
cambiar primero Vercel, actualizar Vault, probar manualmente y reactivar. Si la
conciliación no está operativa, la tienda vuelve a `preview`; no se continúa
aceptando pedidos ambiguos.

Para rotar `STORE_GUEST_TRACKING_SECRET`, detener primero el consumidor de
correos y **no drenar** los eventos pendientes que aún deben generar enlaces.
Anunciar la ventana, cambiar la clave, desplegar, verificar el flujo genérico de
reemisión y recién entonces reanudar la outbox, que firmará los pendientes con
la clave nueva. La rotación invalida cookies y enlaces ya firmados con la clave
anterior; no debe ejecutarse como cambio silencioso durante ventas.
