-- Commerce integrity v1
--
-- 1. Pending card attempts receive a bounded stock reservation and are claimed
--    for provider reconciliation without blocking concurrent workers.
-- 2. Guest orders receive a revocable nonce. The application signs the nonce;
--    no bearer token is stored in Postgres.
--
-- This migration is additive. The historical ecommerce foundation remains
-- immutable so already-applied environments can advance safely.

begin;

alter table public.store_orders
  add column if not exists reservation_expires_at timestamptz,
  add column if not exists inventory_released_at timestamptz,
  add column if not exists inventory_release_reason text,
  add column if not exists reservation_reconcile_locked_at timestamptz,
  add column if not exists reservation_reconcile_token uuid,
  add column if not exists reservation_reconcile_payment_id uuid
    references public.store_payments(id),
  add column if not exists reservation_reconcile_attempts integer not null default 0,
  add column if not exists reservation_provider_not_found_count integer not null default 0,
  add column if not exists reservation_reconcile_error text,
  add column if not exists reservation_reconcile_state text not null default 'idle';

alter table public.store_orders
  alter column reservation_expires_at set default (now() + interval '45 minutes');

-- Outbox leases carry identity, just like reservation leases. Clearing an old
-- timestamp during the migration safely requeues interrupted work; Resend's
-- provider idempotency key protects a send that completed before the cutover.
alter table public.store_outbox_events
  add column if not exists claim_token uuid;

create table if not exists public.store_payment_review_audits (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.store_orders(id) on delete restrict,
  payment_id uuid not null references public.store_payments(id) on delete restrict,
  resolution text not null check (
    resolution in ('confirm_paid', 'cancel_no_charge', 'acknowledge_no_change')
  ),
  provider_reference text not null check (char_length(provider_reference) between 1 and 255),
  actor text not null check (char_length(actor) between 3 and 120),
  reason text not null check (char_length(reason) between 20 and 1000),
  before_snapshot jsonb not null check (jsonb_typeof(before_snapshot) = 'object'),
  after_snapshot jsonb not null check (jsonb_typeof(after_snapshot) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists store_payment_review_audits_order_idx
  on public.store_payment_review_audits (order_id, created_at desc);

alter table public.store_payment_review_audits enable row level security;
revoke all on table public.store_payment_review_audits
  from public, anon, authenticated, service_role;
grant select on table public.store_payment_review_audits to service_role;

update public.store_outbox_events
set locked_at = null,
    claim_token = null
where locked_at is not null
   or claim_token is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'store_outbox_claim_lease_coherent'
      and conrelid = 'public.store_outbox_events'::regclass
  ) then
    alter table public.store_outbox_events
      add constraint store_outbox_claim_lease_coherent
      check ((locked_at is null) = (claim_token is null));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_inventory_release_reason_length'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_inventory_release_reason_length
      check (
        inventory_release_reason is null
        or char_length(inventory_release_reason) <= 120
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_reservation_expiry_required'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_reservation_expiry_required
      check (
        not inventory_reserved
        or payment_state not in ('pending', 'authorized')
        or reservation_expires_at is not null
      ) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_claim_lease_coherent'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_claim_lease_coherent
      check (
        reservation_reconcile_state <> 'claimed'
        or (
          reservation_reconcile_locked_at is not null
          and reservation_reconcile_token is not null
          and reservation_reconcile_payment_id is not null
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_provider_not_found_count_nonnegative'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_provider_not_found_count_nonnegative
      check (reservation_provider_not_found_count >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_reconcile_attempts_nonnegative'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_reconcile_attempts_nonnegative
      check (reservation_reconcile_attempts >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'store_orders_reconcile_state_valid'
      and conrelid = 'public.store_orders'::regclass
  ) then
    alter table public.store_orders
      add constraint store_orders_reconcile_state_valid
      check (
        reservation_reconcile_state in (
          'idle', 'claimed', 'retry', 'needs_review', 'resolved'
        )
      );
  end if;
end;
$$;

-- Existing pending test orders get a grace period after this migration. A
-- deployment must never release inventory immediately merely because old rows
-- did not previously carry an expiry timestamp.
update public.store_orders
set reservation_expires_at = greatest(
      created_at + interval '45 minutes',
      now() + interval '15 minutes'
    ),
    reservation_reconcile_state = 'idle'
where inventory_reserved
  and payment_state in ('pending', 'authorized')
  and reservation_expires_at is null;

update public.store_orders
set reservation_expires_at = null,
    reservation_reconcile_locked_at = null,
    reservation_reconcile_token = null,
    reservation_reconcile_payment_id = null,
    reservation_reconcile_state = 'resolved'
where not inventory_reserved
   or payment_state not in ('pending', 'authorized');

alter table public.store_orders
  validate constraint store_orders_reservation_expiry_required;

create index if not exists store_orders_expired_reservations_idx
  on public.store_orders (reservation_expires_at, id)
  where inventory_reserved
    and payment_state in ('pending', 'authorized')
    and reservation_reconcile_state <> 'needs_review';

create or replace function public.normalize_store_reservation_state()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not new.inventory_reserved
    or new.payment_state not in ('pending', 'authorized') then
    new.reservation_expires_at := null;
    new.reservation_reconcile_locked_at := null;
    new.reservation_reconcile_token := null;
    new.reservation_reconcile_payment_id := null;
    new.reservation_reconcile_error := null;
    new.reservation_reconcile_state := 'resolved';
  end if;

  if old.inventory_reserved
    and not new.inventory_reserved
    and new.payment_state = 'failed' then
    new.inventory_released_at := coalesce(new.inventory_released_at, now());
    new.inventory_release_reason := coalesce(
      new.inventory_release_reason,
      'provider_failed'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists store_orders_normalize_reservation_state
  on public.store_orders;
create trigger store_orders_normalize_reservation_state
before update of inventory_reserved, payment_state on public.store_orders
for each row execute function public.normalize_store_reservation_state();

create table if not exists public.store_order_guest_access (
  order_id uuid primary key
    references public.store_orders(id) on delete cascade,
  nonce uuid not null unique default extensions.gen_random_uuid(),
  token_version integer not null default 1 check (token_version > 0),
  expires_at timestamptz not null default (now() + interval '30 days'),
  revoked_at timestamptz,
  last_accessed_at timestamptz,
  last_issued_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

alter table public.store_order_guest_access enable row level security;

alter table public.store_order_guest_access
  add column if not exists last_issued_at timestamptz not null default now();

revoke all on table public.store_order_guest_access
  from public, anon, authenticated, service_role;
grant all on table public.store_order_guest_access to service_role;

-- Historic guest orders receive an access row lazily only after number + email
-- are verified by queue_store_guest_access_reissue. No old order becomes
-- remotely accessible merely because this migration was applied.

do $$
declare
  v_duplicate_order uuid;
begin
  select payment.order_id
  into v_duplicate_order
  from public.store_payments payment
  where payment.state in ('pending', 'authorized')
  group by payment.order_id
  having count(*) > 1
  limit 1;

  if v_duplicate_order is not null then
    raise exception 'duplicate_unresolved_store_payments_for_order:%',
      v_duplicate_order;
  end if;
end;
$$;

create unique index if not exists store_payments_one_unresolved_per_order
  on public.store_payments (order_id)
  where state in ('pending', 'authorized');

-- Extend the existing outbox topic allow-list without exposing a generic
-- arbitrary topic channel.
alter table public.store_outbox_events
  drop constraint if exists store_outbox_events_topic_check;
alter table public.store_outbox_events
  add constraint store_outbox_events_topic_check check (topic in (
    'order.received',
    'order.payment_confirmed',
    'order.payment_failed',
    'order.expired',
    'order.refunded',
    'shipment.updated'
  ));

create or replace function public.claim_store_outbox_events(
  p_limit integer default 20
)
returns setof public.store_outbox_events
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_limit is null or p_limit not between 1 and 50 then
    raise exception 'invalid_outbox_claim_limit';
  end if;

  return query
  with candidates as (
    select event.id
    from public.store_outbox_events event
    where event.processed_at is null
      and event.failed_at is null
      and event.available_at <= now()
      and (
        event.locked_at is null
        or event.locked_at < now() - interval '10 minutes'
      )
      and event.attempts < event.max_attempts
    order by event.available_at, event.id
    for update skip locked
    limit p_limit
  )
  update public.store_outbox_events event
  set locked_at = now(),
      claim_token = extensions.gen_random_uuid(),
      attempts = event.attempts + 1
  from candidates
  where event.id = candidates.id
    and event.processed_at is null
    and event.failed_at is null
    and (
      event.locked_at is null
      or event.locked_at < now() - interval '10 minutes'
    )
  returning event.*;
end;
$$;

create or replace function public.complete_store_outbox_event(
  p_event_id bigint,
  p_claim_token uuid,
  p_provider_message_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_event_id is null
    or p_claim_token is null
    or nullif(btrim(p_provider_message_id), '') is null then
    raise exception 'invalid_outbox_completion';
  end if;

  update public.store_outbox_events event
  set processed_at = now(),
      locked_at = null,
      claim_token = null,
      provider_message_id = left(p_provider_message_id, 240),
      last_error = null
  where event.id = p_event_id
    and event.claim_token = p_claim_token
    and event.locked_at is not null
    and event.processed_at is null
    and event.failed_at is null;
  return found;
end;
$$;

create or replace function public.fail_store_outbox_event(
  p_event_id bigint,
  p_claim_token uuid,
  p_error text,
  p_retry_seconds integer default 300
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_event_id is null
    or p_claim_token is null
    or p_retry_seconds is null
    or p_retry_seconds not between 30 and 86400 then
    raise exception 'invalid_outbox_failure';
  end if;

  update public.store_outbox_events event
  set locked_at = null,
      claim_token = null,
      last_error = left(coalesce(p_error, 'Error de entrega'), 1000),
      available_at = now() + pg_catalog.make_interval(secs => p_retry_seconds),
      failed_at = case when event.attempts >= event.max_attempts then now() else null end
  where event.id = p_event_id
    and event.claim_token = p_claim_token
    and event.locked_at is not null
    and event.processed_at is null
    and event.failed_at is null;
  return found;
end;
$$;

-- Wrap the original transaction-safe checkout RPC. The nested function call,
-- guest nonce and initial outbox event all commit or roll back together.
create or replace function public.create_store_order_v2(
  p_order jsonb,
  p_items jsonb,
  p_address jsonb
)
returns table (
  order_id uuid,
  order_number text,
  payment_id uuid,
  guest_access_nonce uuid,
  guest_access_expires_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_payment_id uuid;
  v_nonce uuid;
  v_expires_at timestamptz;
  v_fingerprint text;
  v_email text;
  v_open_reservations integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );

  v_fingerprint := nullif(p_order #>> '{metadata,request_fingerprint}', '');
  v_email := lower(nullif(btrim(p_order ->> 'email'), ''));
  if v_fingerprint is null
    or v_fingerprint !~ '^[a-f0-9]{64}$'
    or v_email is null then
    raise exception 'invalid_reservation_principal';
  end if;

  -- These transaction locks make the persistent cap race-safe. It limits
  -- stock starvation even when an attacker changes idempotency keys.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('store-reservation-ip:' || v_fingerprint, 0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('store-reservation-email:' || v_email, 0)
  );

  select count(*)::integer
  into v_open_reservations
  from public.store_orders orders
  where orders.inventory_reserved
    and orders.payment_state in ('pending', 'authorized')
    and orders.created_at > now() - interval '1 hour'
    and (
      orders.metadata ->> 'request_fingerprint' = v_fingerprint
      or lower(orders.email) = v_email
    );

  if v_open_reservations >= 2 then
    raise exception 'too_many_pending_reservations';
  end if;

  -- Checkout is PEN-only and currently assumes every line carries 18% IGV.
  -- Lock the rows so currency/tax cannot change between this guard and v1.
  perform product.id
  from public.store_products product
  join (
    select distinct (item ->> 'product_id')::uuid as product_id
    from jsonb_array_elements(p_items) item
  ) requested on requested.product_id = product.id
  order by product.id
  for update;

  if exists (
    select 1
    from jsonb_array_elements(p_items) item
    join public.store_products product
      on product.id = (item ->> 'product_id')::uuid
    where product.currency <> 'PEN'
       or product.tax_rate <> 0.18
       or product.shipping_class <> 'standard'
  ) then
    raise exception 'unsupported_currency_tax_or_shipping';
  end if;

  select created.order_id, created.order_number, created.payment_id
  into v_order_id, v_order_number, v_payment_id
  from public.create_store_order(p_order, p_items, p_address) created;

  if nullif(p_order ->> 'user_id', '') is null then
    insert into public.store_order_guest_access (order_id)
    values (v_order_id)
    returning nonce, expires_at into v_nonce, v_expires_at;
  end if;

  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key
  )
  select
    'order.received', orders.id, orders.email,
    jsonb_build_object(
      'order_number', orders.order_number,
      'customer_name', orders.customer_name,
      'total_minor', orders.total_minor,
      'guest_access_version', case when v_nonce is not null then 1 else null end
    ),
    'order.received:' || orders.id::text
  from public.store_orders orders
  where orders.id = v_order_id
  on conflict (idempotency_key) do nothing;

  return query
  select v_order_id, v_order_number, v_payment_id, v_nonce, v_expires_at;
end;
$$;

-- Preserve the foundation state machine behind a globally ordered inventory
-- boundary. Checkout, webhook and expiry transitions now take the same lock
-- before any payment/order/product row, preventing cross-order deadlocks while
-- keeping the original audited transition logic immutable.
alter function public.apply_openpay_event(
  bigint, text, text, uuid, bigint, text, text, jsonb, text
) rename to apply_openpay_event_v1_internal;

create function public.apply_openpay_event(
  p_event_id bigint,
  p_event_type text,
  p_external_payment_id text default null,
  p_payment_id uuid default null,
  p_amount_minor bigint default null,
  p_currency text default null,
  p_authorization text default null,
  p_card_summary jsonb default '{}'::jsonb,
  p_failure_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );
  return public.apply_openpay_event_v1_internal(
    p_event_id,
    p_event_type,
    p_external_payment_id,
    p_payment_id,
    p_amount_minor,
    p_currency,
    p_authorization,
    p_card_summary,
    p_failure_message
  );
end;
$$;

-- Ingestion and state transition must be one database transaction. Otherwise
-- an authenticated provider event can be visible before it is linked to the
-- payment, allowing an expiry worker to release the same inventory in between.
create function public.ingest_and_apply_openpay_event(
  p_event_key text,
  p_event_type text,
  p_external_payment_id text,
  p_payment_id uuid,
  p_order_id uuid,
  p_payload jsonb,
  p_amount_minor bigint,
  p_currency text,
  p_authorization text default null,
  p_card_summary jsonb default '{}'::jsonb,
  p_failure_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_id bigint;
  v_existing_type text;
  v_existing_external_id text;
  v_existing_payment_id uuid;
  v_existing_order_id uuid;
  v_existing_processed_at timestamptz;
  v_resolved_payment_id uuid;
  v_resolved_order_id uuid;
  v_resolved_payment_currency text;
  v_result jsonb;
  v_status text;
begin
  if nullif(btrim(p_event_key), '') is null
    or char_length(p_event_key) > 240
    or nullif(btrim(p_event_type), '') is null
    or char_length(p_event_type) > 80
    or p_event_type !~ '^[A-Za-z0-9][A-Za-z0-9._:-]*$'
    or nullif(btrim(p_external_payment_id), '') is null
    or jsonb_typeof(p_payload) <> 'object'
    or jsonb_typeof(coalesce(p_card_summary, '{}'::jsonb)) <> 'object' then
    raise exception 'invalid_openpay_event';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );

  if p_payment_id is not null then
    select payment.id, payment.order_id, payment.currency::text
    into v_resolved_payment_id, v_resolved_order_id, v_resolved_payment_currency
    from public.store_payments payment
    where payment.id = p_payment_id;

    if found
      and p_order_id is not null
      and v_resolved_order_id <> p_order_id then
      raise exception 'openpay_event_order_mismatch';
    end if;
  end if;
  if v_resolved_payment_id is null and p_payment_id is null then
    select payment.id, payment.order_id, payment.currency::text
    into v_resolved_payment_id, v_resolved_order_id, v_resolved_payment_currency
    from public.store_payments payment
    where payment.external_id = p_external_payment_id;
  end if;
  if v_resolved_order_id is null and p_order_id is not null then
    select orders.id
    into v_resolved_order_id
    from public.store_orders orders
    where orders.id = p_order_id;
  end if;

  insert into public.store_payment_events (
    provider, event_key, event_type, external_payment_id,
    payment_id, order_id, payload
  ) values (
    'openpay', p_event_key, p_event_type, p_external_payment_id,
    v_resolved_payment_id, v_resolved_order_id, p_payload
  )
  on conflict (event_key) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select
      event.id,
      event.event_type,
      event.external_payment_id,
      event.payment_id,
      event.order_id,
      event.processed_at
    into
      v_event_id,
      v_existing_type,
      v_existing_external_id,
      v_existing_payment_id,
      v_existing_order_id,
      v_existing_processed_at
    from public.store_payment_events event
    where event.event_key = p_event_key
    for update;

    if v_existing_type <> p_event_type
      or v_existing_external_id is distinct from p_external_payment_id
      or (
        v_existing_payment_id is not null
        and v_resolved_payment_id is not null
        and v_existing_payment_id <> v_resolved_payment_id
      )
      or (
        v_existing_order_id is not null
        and v_resolved_order_id is not null
        and v_existing_order_id <> v_resolved_order_id
      ) then
      raise exception 'openpay_event_identity_conflict';
    end if;

    if v_existing_processed_at is not null then
      return jsonb_build_object(
        'status', 'already_processed',
        'event_id', v_event_id,
        'payment_id', v_existing_payment_id,
        'order_id', v_existing_order_id
      );
    end if;
  end if;

  if p_event_type not in (
    'charge.pending', 'charge.succeeded', 'charge.failed',
    'charge.cancelled', 'charge.refunded', 'chargeback.created',
    'chargeback.accepted', 'chargeback.rejected'
  ) then
    -- Future or malformed provider events are evidence, not transitions. Link
    -- them to the local attempt for operations, but never let untrusted fields
    -- bind external_id, authorization or card_summary on store_payments.
    update public.store_payment_events event
    set payment_id = coalesce(event.payment_id, v_resolved_payment_id),
        order_id = coalesce(event.order_id, v_resolved_order_id),
        processed_at = now(),
        processing_error = 'Evento Openpay no automatizable; requiere revisión'
    where event.id = v_event_id;
    v_result := jsonb_build_object(
      'status', 'event_recorded_no_state_change',
      'payment_id', v_resolved_payment_id,
      'order_id', v_resolved_order_id
    );
  elsif v_resolved_payment_id is not null
    and (
      coalesce(upper(btrim(v_resolved_payment_currency)), '') <> 'PEN'
      or (
        p_currency is not null
        and upper(btrim(p_currency)) <> 'PEN'
      )
    ) then
    -- Openpay notifications may omit transaction.currency. In that case the
    -- locked local attempt is authoritative, but this store only settles PEN.
    update public.store_payment_events event
    set payment_id = coalesce(event.payment_id, v_resolved_payment_id),
        order_id = coalesce(event.order_id, v_resolved_order_id),
        processed_at = now(),
        processing_error = 'Moneda no permitida para la tienda PEN'
    where event.id = v_event_id;
    v_result := jsonb_build_object(
      'status', 'rejected_amount_or_currency',
      'payment_id', v_resolved_payment_id,
      'order_id', v_resolved_order_id
    );
  else
    v_result := public.apply_openpay_event_v1_internal(
      v_event_id,
      p_event_type,
      p_external_payment_id,
      p_payment_id,
      p_amount_minor,
      p_currency,
      p_authorization,
      coalesce(p_card_summary, '{}'::jsonb),
      p_failure_message
    );
  end if;
  v_status := coalesce(v_result ->> 'status', 'missing_status');

  select event.order_id
  into v_resolved_order_id
  from public.store_payment_events event
  where event.id = v_event_id;

  if v_status = 'manual_reconciliation'
    or v_status = 'pending_reconciliation'
    or (
      v_status = 'event_recorded_no_state_change'
      and p_event_type <> 'charge.pending'
    )
    or v_status in (
      'stale_refund_ignored',
      'stale_chargeback_ignored',
      'chargeback_rejection_not_applicable'
    )
    or v_status like 'rejected_%' then
    update public.store_orders orders
    set reservation_reconcile_locked_at = null,
        reservation_reconcile_token = null,
        reservation_reconcile_payment_id = null,
        reservation_reconcile_state = 'needs_review',
        reservation_reconcile_error = left(
          'Evento Openpay ' || v_event_id::text || ' requiere revisión: ' || v_status,
          500
        ),
        updated_at = now()
    where orders.id = v_resolved_order_id;

    if found then
      insert into public.store_order_events (
        order_id, event_type, internal_note, actor_type
      ) values (
        v_resolved_order_id,
        'payment_review_required',
        left(
          'Evento Openpay ' || v_event_id::text || ' requiere revisión: ' || v_status,
          1000
        ),
        'system'
      );
    end if;
  end if;

  return v_result || jsonb_build_object('event_id', v_event_id);
end;
$$;

-- Claim work by locking the payment row before the order row. This matches the
-- lock order in apply_openpay_event and prevents webhook/reaper deadlocks.
create or replace function public.claim_expired_store_reservations(
  p_limit integer default 20
)
returns table (
  order_id uuid,
  order_number text,
  payment_id uuid,
  external_payment_id text,
  amount_minor bigint,
  currency text,
  reservation_expires_at timestamptz,
  lease_token uuid,
  reconciliation_attempts integer,
  order_created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception 'invalid_reconciliation_limit';
  end if;

  return query
  with candidates as materialized (
    select
      payment.id as payment_id,
      orders.id as order_id
    from public.store_payments payment
    join public.store_orders orders on orders.id = payment.order_id
    where payment.state in ('pending', 'authorized')
      and orders.payment_state in ('pending', 'authorized')
      and orders.order_state = 'payment_pending'
      and orders.inventory_reserved
      and orders.reservation_expires_at <= now()
      and orders.reservation_reconcile_state <> 'needs_review'
      and (
        orders.reservation_reconcile_locked_at is null
        or orders.reservation_reconcile_locked_at < now() - interval '10 minutes'
      )
      and payment.id = (
        select latest.id
        from public.store_payments latest
        where latest.order_id = orders.id
          and latest.state in ('pending', 'authorized')
        order by latest.created_at desc, latest.id desc
        limit 1
      )
    order by orders.reservation_expires_at, orders.id
    for update of payment skip locked
    limit p_limit
  ), claimed as (
    update public.store_orders orders
    set reservation_reconcile_locked_at = now(),
        reservation_reconcile_token = extensions.gen_random_uuid(),
        reservation_reconcile_payment_id = candidates.payment_id,
        reservation_reconcile_attempts = orders.reservation_reconcile_attempts + 1,
        reservation_reconcile_state = 'claimed',
        reservation_reconcile_error = null,
        updated_at = now()
    from candidates
    where orders.id = candidates.order_id
      and orders.inventory_reserved
      and orders.payment_state in ('pending', 'authorized')
      and orders.reservation_expires_at <= now()
      and orders.reservation_reconcile_state <> 'needs_review'
      and (
        orders.reservation_reconcile_locked_at is null
        or orders.reservation_reconcile_locked_at < now() - interval '10 minutes'
      )
    returning
      orders.id,
      orders.order_number,
      candidates.payment_id,
      orders.reservation_expires_at,
      orders.reservation_reconcile_token,
      orders.reservation_reconcile_attempts,
      orders.created_at
  )
  select
    claimed.id,
    claimed.order_number,
    payment.id,
    payment.external_id,
    payment.amount_minor,
    payment.currency::text,
    claimed.reservation_expires_at,
    claimed.reservation_reconcile_token,
    claimed.reservation_reconcile_attempts,
    claimed.created_at
  from claimed
  join public.store_payments payment on payment.id = claimed.payment_id;
end;
$$;

create or replace function public.defer_store_order_reservation(
  p_order_id uuid,
  p_payment_id uuid,
  p_lease_token uuid,
  p_retry_seconds integer default 300,
  p_error text default null,
  p_provider_observed boolean default false
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_state text;
begin
  if p_retry_seconds is null or p_retry_seconds not between 30 and 86400 then
    raise exception 'invalid_retry_delay';
  end if;

  update public.store_orders orders
  set reservation_reconcile_locked_at = null,
      reservation_reconcile_token = null,
      reservation_reconcile_payment_id = null,
      reservation_provider_not_found_count = case
        when p_provider_observed then 0
        else orders.reservation_provider_not_found_count
      end,
      reservation_reconcile_error = left(p_error, 500),
      reservation_reconcile_state = case
        when orders.reservation_reconcile_attempts >= 20
          or orders.created_at < now() - interval '24 hours'
          then 'needs_review'
        else 'retry'
      end,
      reservation_expires_at = case
        when orders.reservation_reconcile_attempts >= 20
          or orders.created_at < now() - interval '24 hours'
          then orders.reservation_expires_at
        else now() + make_interval(secs => p_retry_seconds)
      end,
      updated_at = now()
  where orders.id = p_order_id
    and orders.reservation_reconcile_state = 'claimed'
    and orders.reservation_reconcile_token = p_lease_token
    and orders.reservation_reconcile_payment_id = p_payment_id
    and orders.inventory_reserved
    and orders.payment_state in ('pending', 'authorized')
  returning orders.reservation_reconcile_state into v_state;

  if v_state is not null then
    return v_state;
  end if;
  select orders.reservation_reconcile_state
  into v_state
  from public.store_orders orders
  where orders.id = p_order_id;
  return case when v_state = 'needs_review' then 'already_review' else 'lease_lost' end;
end;
$$;

create or replace function public.mark_store_order_reservation_review(
  p_order_id uuid,
  p_payment_id uuid,
  p_lease_token uuid,
  p_error text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_state text;
begin
  update public.store_orders orders
  set reservation_reconcile_locked_at = null,
      reservation_reconcile_token = null,
      reservation_reconcile_payment_id = null,
      reservation_provider_not_found_count = 0,
      reservation_reconcile_error = left(p_error, 500),
      reservation_reconcile_state = 'needs_review',
      updated_at = now()
  where orders.id = p_order_id
    and orders.reservation_reconcile_state = 'claimed'
    and orders.reservation_reconcile_token = p_lease_token
    and orders.reservation_reconcile_payment_id = p_payment_id
    and orders.inventory_reserved
    and orders.payment_state in ('pending', 'authorized')
  returning orders.reservation_reconcile_state into v_state;

  if v_state is not null then
    return v_state;
  end if;
  select orders.reservation_reconcile_state
  into v_state
  from public.store_orders orders
  where orders.id = p_order_id;
  return case when v_state = 'needs_review' then 'already_review' else 'lease_lost' end;
end;
$$;

-- Checkout can observe an ambiguous provider state before the reservation is
-- old enough for the cron lease. Flag it immediately so operations do not have
-- a 45-minute blind spot.
create function public.flag_store_order_payment_review(
  p_order_id uuid,
  p_payment_id uuid,
  p_reason text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment_state text;
  v_order_state text;
  v_order_payment_state text;
  v_existing_review_state text;
begin
  if p_order_id is null
    or p_payment_id is null
    or char_length(btrim(coalesce(p_reason, ''))) not between 10 and 500 then
    raise exception 'invalid_payment_review_request';
  end if;

  select payment.state
  into v_payment_state
  from public.store_payments payment
  where payment.id = p_payment_id
    and payment.order_id = p_order_id
  for update;
  if not found then
    return 'payment_not_found';
  end if;

  select orders.order_state, orders.payment_state,
         orders.reservation_reconcile_state
  into v_order_state, v_order_payment_state, v_existing_review_state
  from public.store_orders orders
  where orders.id = p_order_id
  for update;
  if not found then
    return 'order_not_found';
  end if;

  if v_existing_review_state = 'needs_review' then
    return 'already_review';
  end if;
  if v_payment_state = 'paid'
    and v_order_payment_state = 'paid'
    and v_order_state = 'confirmed' then
    return 'already_confirmed';
  end if;

  update public.store_orders orders
  set reservation_reconcile_locked_at = null,
      reservation_reconcile_token = null,
      reservation_reconcile_payment_id = null,
      reservation_reconcile_state = 'needs_review',
      reservation_reconcile_error = left(p_reason, 500),
      updated_at = now()
  where orders.id = p_order_id;

  insert into public.store_order_events (
    order_id, event_type, internal_note, actor_type
  ) values (
    p_order_id,
    'payment_review_required',
    left(p_reason, 1000),
    'system'
  );

  return 'needs_review';
end;
$$;

create or replace function public.expire_store_order_reservation(
  p_order_id uuid,
  p_payment_id uuid,
  p_lease_token uuid,
  p_reason text default 'provider_not_found'
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment_id uuid;
  v_external_payment_id text;
  v_payment_state text;
  v_order_number text;
  v_email text;
  v_customer_name text;
  v_total_minor bigint;
  v_not_found_count integer;
  v_expires_at timestamptz;
  v_reserved boolean;
  v_order_state text;
  v_order_payment_state text;
  v_reconcile_state text;
  v_lease_token uuid;
  v_claim_payment_id uuid;
  v_provider_evidence boolean;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );

  select payment.id, payment.external_id, payment.state
  into v_payment_id, v_external_payment_id, v_payment_state
  from public.store_payments payment
  where payment.id = p_payment_id
    and payment.order_id = p_order_id
    and payment.state in ('pending', 'authorized')
  for update;

  if not found then
    return 'payment_already_resolved';
  end if;

  select
    orders.order_number,
    orders.email,
    orders.customer_name,
    orders.total_minor,
    orders.reservation_provider_not_found_count,
    orders.reservation_expires_at,
    orders.inventory_reserved,
    orders.order_state,
    orders.payment_state,
    orders.reservation_reconcile_state,
    orders.reservation_reconcile_token,
    orders.reservation_reconcile_payment_id
  into
    v_order_number,
    v_email,
    v_customer_name,
    v_total_minor,
    v_not_found_count,
    v_expires_at,
    v_reserved,
    v_order_state,
    v_order_payment_state,
    v_reconcile_state,
    v_lease_token,
    v_claim_payment_id
  from public.store_orders orders
  where orders.id = p_order_id
  for update;

  if not found or not v_reserved then
    return 'already_released';
  end if;

  if v_order_state <> 'payment_pending'
    or v_order_payment_state not in ('pending', 'authorized') then
    return 'order_already_resolved';
  end if;

  if v_reconcile_state <> 'claimed'
    or v_lease_token is distinct from p_lease_token
    or v_claim_payment_id is distinct from p_payment_id then
    return 'lease_lost';
  end if;

  if v_expires_at is null or v_expires_at > now() then
    return 'not_expired';
  end if;

  select exists (
    select 1
    from public.store_payment_events event
    where event.payment_id = v_payment_id
      and event.external_payment_id is not null
  ) into v_provider_evidence;

  -- Any provider identifier or recorded provider event is evidence that a
  -- charge may exist. An empty list response must never override that evidence.
  if v_payment_state = 'authorized'
    or v_order_payment_state = 'authorized'
    or v_external_payment_id is not null
    or v_provider_evidence then
    update public.store_orders orders
    set reservation_reconcile_locked_at = null,
        reservation_reconcile_token = null,
        reservation_reconcile_payment_id = null,
        reservation_reconcile_state = 'needs_review',
        reservation_reconcile_error =
          'Openpay devolvió vacío pese a existir autorización o evidencia previa de cargo.',
        updated_at = now()
    where orders.id = p_order_id
      and orders.reservation_reconcile_token = p_lease_token;
    return 'needs_review';
  end if;

  v_not_found_count := v_not_found_count + 1;

  -- Count only successful, empty provider lookups. Network/API failures are
  -- handled by defer_store_order_reservation and never advance this counter.
  if v_not_found_count < 2 then
    update public.store_orders orders
    set reservation_provider_not_found_count = v_not_found_count,
        reservation_reconcile_locked_at = null,
        reservation_reconcile_token = null,
        reservation_reconcile_payment_id = null,
        reservation_reconcile_state = 'retry',
        reservation_reconcile_error =
          'Primera búsqueda vacía confirmada; se conserva el inventario.',
        reservation_expires_at = now() + interval '5 minutes',
        updated_at = now()
    where orders.id = p_order_id
      and orders.reservation_reconcile_token = p_lease_token;
    return 'grace_required';
  end if;

  perform product.id
  from public.store_products product
  join (
    select distinct item.product_id
    from public.store_order_items item
    where item.order_id = p_order_id
      and item.product_id is not null
  ) selected on selected.product_id = product.id
  order by product.id
  for update of product;

  update public.store_products product
  set stock_quantity = product.stock_quantity + sold.quantity,
      updated_at = now()
  from (
    select item.product_id, sum(item.quantity)::integer as quantity
    from public.store_order_items item
    where item.order_id = p_order_id
      and item.product_id is not null
    group by item.product_id
  ) sold
  where product.id = sold.product_id;

  update public.store_payments payment
  set state = 'failed',
      failure_code = 'reservation_expired',
      failure_message = 'Openpay no reportó un cargo para el intento conciliado.',
      updated_at = now()
  where payment.id = v_payment_id
    and payment.state in ('pending', 'authorized');

  update public.store_orders orders
  set inventory_reserved = false,
      payment_state = 'failed',
      order_state = 'cancelled',
      cancelled_at = coalesce(orders.cancelled_at, now()),
      inventory_released_at = now(),
      inventory_release_reason = left(coalesce(p_reason, 'provider_not_found'), 120),
      reservation_provider_not_found_count = v_not_found_count,
      reservation_reconcile_error = null,
      updated_at = now()
  where orders.id = p_order_id
    and orders.inventory_reserved;

  insert into public.store_order_events (
    order_id, event_type, from_state, to_state, public_message, actor_type
  ) values (
    p_order_id,
    'reservation_expired',
    'payment_pending',
    'cancelled',
    'La reserva venció sin un pago confirmado. El pedido fue cancelado y puedes intentarlo nuevamente.',
    'system'
  );

  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key
  ) values (
    'order.expired',
    p_order_id,
    v_email,
    jsonb_build_object(
      'order_number', v_order_number,
      'customer_name', v_customer_name,
      'total_minor', v_total_minor,
      'failure_reason', left(coalesce(p_reason, 'provider_not_found'), 120)
    ),
    'order.expired:' || p_order_id::text
  )
  on conflict (idempotency_key) do nothing;

  return 'expired';
end;
$$;

-- Replace the immediate-rejection helper with the same payment -> order lock
-- order used by the webhook state machine and reconciliation worker.
create or replace function public.release_store_order_inventory_v2(
  p_order_id uuid,
  p_payment_id uuid,
  p_failure_code text default null,
  p_failure_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reserved boolean;
  v_payment_state text;
  v_order_state text;
  v_external_payment_id text;
  v_provider_evidence boolean;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );

  select payment.state, payment.external_id
  into v_payment_state, v_external_payment_id
  from public.store_payments payment
  where payment.id = p_payment_id
    and payment.order_id = p_order_id
  for update;

  if not found
    or v_payment_state <> 'pending'
    or v_external_payment_id is not null then
    return false;
  end if;

  select exists (
    select 1
    from public.store_payment_events event
    where event.payment_id = p_payment_id
      and event.external_payment_id is not null
  ) into v_provider_evidence;
  if v_provider_evidence then
    return false;
  end if;

  select orders.inventory_reserved, orders.payment_state, orders.order_state
  into v_reserved, v_payment_state, v_order_state
  from public.store_orders orders
  where orders.id = p_order_id
  for update;

  if not found
    or not v_reserved
    or v_payment_state <> 'pending'
    or v_order_state <> 'payment_pending' then
    return false;
  end if;

  perform product.id
  from public.store_products product
  join (
    select distinct item.product_id
    from public.store_order_items item
    where item.order_id = p_order_id
      and item.product_id is not null
  ) selected on selected.product_id = product.id
  order by product.id
  for update of product;

  update public.store_products product
  set stock_quantity = product.stock_quantity + sold.quantity,
      updated_at = now()
  from (
    select item.product_id, sum(item.quantity)::integer as quantity
    from public.store_order_items item
    where item.order_id = p_order_id
      and item.product_id is not null
    group by item.product_id
  ) sold
  where product.id = sold.product_id;

  update public.store_payments payment
  set state = 'failed',
      failure_code = left(p_failure_code, 120),
      failure_message = left(p_failure_message, 500),
      updated_at = now()
  where payment.id = p_payment_id
    and payment.state = 'pending'
    and payment.external_id is null;

  update public.store_orders orders
  set inventory_reserved = false,
      payment_state = 'failed',
      order_state = 'cancelled',
      cancelled_at = coalesce(orders.cancelled_at, now()),
      inventory_released_at = now(),
      inventory_release_reason = left(
        coalesce(nullif(p_failure_code, ''), 'provider_rejected'),
        120
      ),
      reservation_reconcile_error = null,
      updated_at = now()
  where orders.id = p_order_id;

  insert into public.store_order_events (
    order_id, event_type, from_state, to_state, public_message, actor_type
  ) values (
    p_order_id, 'payment_failed', v_order_state, 'cancelled',
    'El pago no fue aprobado y el pedido fue cancelado.', 'provider'
  );

  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key
  )
  select
    'order.payment_failed', orders.id, orders.email,
    jsonb_build_object(
      'order_number', orders.order_number,
      'customer_name', orders.customer_name,
      'total_minor', orders.total_minor,
      'failure_reason', left(
        coalesce(nullif(p_failure_code, ''), 'provider_rejected'),
        120
      )
    ),
    'order.payment_failed:' || orders.id::text
  from public.store_orders orders
  where orders.id = p_order_id
  on conflict (idempotency_key) do nothing;

  return true;
end;
$$;

-- Explicit, audited escape hatch for a human-reviewed payment. This is the
-- only supported way to resolve needs_review; it keeps payment, order, stock,
-- coupon and notifications in one transaction.
create function public.resolve_store_order_payment_review(
  p_order_id uuid,
  p_payment_id uuid,
  p_resolution text,
  p_provider_reference text,
  p_actor text,
  p_reason text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment_state text;
  v_external_id text;
  v_order_state text;
  v_order_payment_state text;
  v_inventory_reserved boolean;
  v_inventory_released_at timestamptz;
  v_review_state text;
  v_already_paid boolean;
  v_reconsume_inventory boolean;
  v_target_order_state text;
  v_before jsonb;
begin
  if p_resolution not in (
      'confirm_paid', 'cancel_no_charge', 'acknowledge_no_change'
    )
    or char_length(btrim(coalesce(p_provider_reference, ''))) not between 1 and 255
    or char_length(btrim(coalesce(p_actor, ''))) not between 3 and 120
    or char_length(btrim(coalesce(p_reason, ''))) not between 20 and 1000 then
    raise exception 'invalid_manual_review_resolution';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('casa-atenta-store-inventory-v1', 0)
  );

  select payment.state, payment.external_id
  into v_payment_state, v_external_id
  from public.store_payments payment
  where payment.id = p_payment_id
    and payment.order_id = p_order_id
  for update;
  if not found then
    return 'payment_not_found';
  end if;

  select orders.order_state, orders.payment_state,
         orders.inventory_reserved, orders.inventory_released_at,
         orders.reservation_reconcile_state
  into v_order_state, v_order_payment_state,
       v_inventory_reserved, v_inventory_released_at, v_review_state
  from public.store_orders orders
  where orders.id = p_order_id
  for update;
  if not found then
    return 'order_not_found';
  end if;
  if v_review_state <> 'needs_review' then
    return 'review_not_open';
  end if;

  v_before := jsonb_build_object(
    'order_state', v_order_state,
    'order_payment_state', v_order_payment_state,
    'payment_state', v_payment_state,
    'inventory_reserved', v_inventory_reserved,
    'external_payment_id', v_external_id
  );

  if p_resolution = 'confirm_paid' then
    if v_payment_state in ('refunded', 'partially_refunded', 'chargeback') then
      return 'payment_state_not_confirmable';
    end if;
    if v_external_id is not null
      and v_external_id <> btrim(p_provider_reference) then
      return 'provider_reference_mismatch';
    end if;

    v_already_paid := v_payment_state = 'paid'
      and v_order_payment_state = 'paid'
      and v_order_state in (
        'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered'
      );
    v_target_order_state := case
      when v_already_paid then v_order_state
      else 'confirmed'
    end;
    v_reconsume_inventory := not v_inventory_reserved
      and not v_already_paid
      and v_inventory_released_at is not null;
    if not v_inventory_reserved
      and not v_already_paid
      and not v_reconsume_inventory then
      return 'inventory_history_ambiguous';
    end if;

    if v_reconsume_inventory then
      perform product.id
      from public.store_products product
      join (
        select distinct item.product_id
        from public.store_order_items item
        where item.order_id = p_order_id
          and item.product_id is not null
      ) selected on selected.product_id = product.id
      order by product.id
      for update of product;
    end if;

    if v_reconsume_inventory and exists (
      select 1
      from (
        select item.product_id, sum(item.quantity)::integer as quantity
        from public.store_order_items item
        where item.order_id = p_order_id
          and item.product_id is not null
        group by item.product_id
      ) sold
      join public.store_products product on product.id = sold.product_id
      where product.stock_quantity < sold.quantity
    ) then
      return 'insufficient_stock_for_paid_review';
    end if;

    if v_reconsume_inventory then
      update public.store_products product
      set stock_quantity = product.stock_quantity - sold.quantity,
          updated_at = now()
      from (
        select item.product_id, sum(item.quantity)::integer as quantity
        from public.store_order_items item
        where item.order_id = p_order_id
          and item.product_id is not null
        group by item.product_id
      ) sold
      where product.id = sold.product_id;
    end if;

    update public.store_payments payment
    set state = 'paid',
        external_id = coalesce(payment.external_id, btrim(p_provider_reference)),
        failure_code = null,
        failure_message = null,
        updated_at = now()
    where payment.id = p_payment_id;

    update public.store_orders orders
    set order_state = v_target_order_state,
        payment_state = 'paid',
        inventory_reserved = false,
        paid_at = coalesce(orders.paid_at, now()),
        cancelled_at = null,
        inventory_released_at = null,
        inventory_release_reason = null,
        reservation_reconcile_state = 'resolved',
        reservation_reconcile_error = null,
        updated_at = now()
    where orders.id = p_order_id;

    with inserted_redemption as (
      insert into public.coupon_redemptions (
        coupon_id, order_id, user_id, email, discount_minor
      )
      select coupon.id, orders.id, orders.user_id, orders.email,
             orders.discount_minor
      from public.store_orders orders
      join public.coupons coupon on coupon.code = orders.coupon_code
      where orders.id = p_order_id
        and orders.coupon_code is not null
      on conflict (order_id) do nothing
      returning coupon_id
    )
    update public.coupons coupon
    set redemptions_count = coupon.redemptions_count + 1
    where coupon.id in (select coupon_id from inserted_redemption);

    insert into public.store_order_events (
      order_id, event_type, from_state, to_state,
      public_message, internal_note, actor_type
    ) values (
      p_order_id, 'payment_review_confirmed', v_order_state, v_target_order_state,
      case
        when v_already_paid then
          'La revisión confirmó el pago. El pedido conserva su estado de atención.'
        else
          'Pago confirmado después de una revisión. Prepararemos tu pedido.'
      end,
      left('Actor: ' || btrim(p_actor) || '. ' || btrim(p_reason), 1000),
      'staff'
    );

    insert into public.store_outbox_events (
      topic, aggregate_id, recipient_email, payload, idempotency_key
    )
    select
      'order.payment_confirmed', orders.id, orders.email,
      jsonb_build_object(
        'order_number', orders.order_number,
        'customer_name', orders.customer_name,
        'total_minor', orders.total_minor
      ),
      'order.payment_confirmed:' || orders.id::text
    from public.store_orders orders
    where orders.id = p_order_id
    on conflict (idempotency_key) do nothing;
  elsif p_resolution = 'cancel_no_charge' then
    if v_payment_state in ('paid', 'refunded', 'partially_refunded', 'chargeback') then
      return 'payment_state_not_cancellable';
    end if;

    if v_inventory_reserved then
      perform product.id
      from public.store_products product
      join (
        select distinct item.product_id
        from public.store_order_items item
        where item.order_id = p_order_id
          and item.product_id is not null
      ) selected on selected.product_id = product.id
      order by product.id
      for update of product;

      update public.store_products product
      set stock_quantity = product.stock_quantity + sold.quantity,
          updated_at = now()
      from (
        select item.product_id, sum(item.quantity)::integer as quantity
        from public.store_order_items item
        where item.order_id = p_order_id
          and item.product_id is not null
        group by item.product_id
      ) sold
      where product.id = sold.product_id;
    end if;

    update public.store_payments payment
    set state = 'failed',
        failure_code = 'manual_no_charge',
        failure_message = 'Openpay confirmó ausencia o cancelación del cargo.',
        updated_at = now()
    where payment.id = p_payment_id;

    update public.store_orders orders
    set order_state = 'cancelled',
        payment_state = 'failed',
        inventory_reserved = false,
        cancelled_at = coalesce(orders.cancelled_at, now()),
        inventory_released_at = case
          when v_inventory_reserved then now()
          else orders.inventory_released_at
        end,
        inventory_release_reason = 'manual_no_charge',
        reservation_reconcile_state = 'resolved',
        reservation_reconcile_error = null,
        updated_at = now()
    where orders.id = p_order_id;

    insert into public.store_order_events (
      order_id, event_type, from_state, to_state,
      public_message, internal_note, actor_type
    ) values (
      p_order_id, 'payment_review_cancelled', v_order_state, 'cancelled',
      'La revisión confirmó que no existe un pago aprobado. El pedido fue cancelado.',
      left('Actor: ' || btrim(p_actor) || '. ' || btrim(p_reason), 1000),
      'staff'
    );

    insert into public.store_outbox_events (
      topic, aggregate_id, recipient_email, payload, idempotency_key
    )
    select
      'order.payment_failed', orders.id, orders.email,
      jsonb_build_object(
        'order_number', orders.order_number,
        'customer_name', orders.customer_name,
        'total_minor', orders.total_minor
      ),
      'order.payment_failed:' || orders.id::text
    from public.store_orders orders
    where orders.id = p_order_id
    on conflict (idempotency_key) do nothing;
  else
    if v_payment_state in ('pending', 'authorized')
      or v_order_payment_state in ('pending', 'authorized') then
      return 'payment_state_requires_resolution';
    end if;
    if v_inventory_reserved then
      return 'inventory_still_reserved';
    end if;

    update public.store_orders orders
    set reservation_reconcile_locked_at = null,
        reservation_reconcile_token = null,
        reservation_reconcile_payment_id = null,
        reservation_reconcile_state = 'resolved',
        reservation_reconcile_error = null,
        updated_at = now()
    where orders.id = p_order_id;

    insert into public.store_order_events (
      order_id, event_type, from_state, to_state, internal_note, actor_type
    ) values (
      p_order_id, 'payment_review_acknowledged', v_order_state, v_order_state,
      left('Actor: ' || btrim(p_actor) || '. ' || btrim(p_reason), 1000),
      'staff'
    );
  end if;

  insert into public.store_payment_review_audits (
    order_id, payment_id, resolution, provider_reference, actor, reason,
    before_snapshot, after_snapshot
  ) values (
    p_order_id,
    p_payment_id,
    p_resolution,
    btrim(p_provider_reference),
    btrim(p_actor),
    btrim(p_reason),
    v_before,
    jsonb_build_object(
      'order_state', case
        when p_resolution = 'confirm_paid' then v_target_order_state
        when p_resolution = 'cancel_no_charge' then 'cancelled'
        else v_order_state
      end,
      'payment_state', case
        when p_resolution = 'confirm_paid' then 'paid'
        when p_resolution = 'cancel_no_charge' then 'failed'
        else v_order_payment_state
      end,
      'inventory_reserved', case
        when p_resolution = 'acknowledge_no_change' then v_inventory_reserved
        else false
      end
    )
  );

  return case
    when p_resolution = 'confirm_paid' then 'confirmed'
    when p_resolution = 'cancel_no_charge' then 'cancelled'
    else 'acknowledged'
  end;
end;
$$;

create or replace function public.get_store_guest_tracking(
  p_order_id uuid,
  p_nonce uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  perform access.order_id
  from public.store_order_guest_access access
  join public.store_orders orders on orders.id = access.order_id
  where access.order_id = p_order_id
    and access.nonce = p_nonce
    and access.revoked_at is null
    and access.expires_at > now()
    and orders.user_id is null
  for update of access;

  if not found then
    return null;
  end if;

  update public.store_order_guest_access access
  set last_accessed_at = now(),
      updated_at = now()
  where access.order_id = p_order_id;

  select jsonb_build_object(
    'order', jsonb_build_object(
      'id', orders.id,
      'order_number', orders.order_number,
      'order_state', orders.order_state,
      'payment_state', orders.payment_state,
      'fulfilment_state', orders.fulfilment_state,
      'currency', orders.currency,
      'subtotal_minor', orders.subtotal_minor,
      'discount_minor', orders.discount_minor,
      'shipping_minor', orders.shipping_minor,
      'tax_minor', orders.tax_minor,
      'total_minor', orders.total_minor,
      'invoice_type', orders.invoice_type,
      'created_at', orders.created_at,
      'paid_at', orders.paid_at,
      'cancelled_at', orders.cancelled_at
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', item.id,
        'sku', item.sku,
        'name', item.name,
        'quantity', item.quantity,
        'unit_price_minor', item.unit_price_minor,
        'total_minor', item.total_minor
      ) order by item.id)
      from public.store_order_items item
      where item.order_id = orders.id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', event.id,
        'event_type', event.event_type,
        'to_state', event.to_state,
        'public_message', event.public_message,
        'created_at', event.created_at
      ) order by event.created_at, event.id)
      from public.store_order_events event
      where event.order_id = orders.id
        and event.public_message is not null
    ), '[]'::jsonb),
    'shipment', (
      select jsonb_build_object(
        'carrier', shipment.carrier,
        'service', shipment.service,
        'tracking_number', shipment.tracking_number,
        'tracking_url', shipment.tracking_url,
        'state', shipment.state,
        'estimated_delivery_at', shipment.estimated_delivery_at,
        'shipped_at', shipment.shipped_at,
        'delivered_at', shipment.delivered_at
      )
      from public.store_shipments shipment
      where shipment.order_id = orders.id
      order by shipment.created_at desc, shipment.id desc
      limit 1
    )
  )
  into v_result
  from public.store_orders orders
  where orders.id = p_order_id
    and orders.user_id is null;

  return v_result;
end;
$$;

create or replace function public.queue_store_guest_access_reissue(
  p_order_number text,
  p_email text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_email text;
  v_customer_name text;
  v_total_minor bigint;
  v_token_version integer;
  v_last_issued_at timestamptz;
begin
  select
    orders.id,
    orders.email,
    orders.customer_name,
    orders.total_minor
  into
    v_order_id,
    v_email,
    v_customer_name,
    v_total_minor
  from public.store_orders orders
  where orders.order_number = upper(trim(p_order_number))
    and lower(orders.email) = lower(trim(p_email))
    and orders.user_id is null
  for update;

  if not found then
    return false;
  end if;

  select access.last_issued_at
  into v_last_issued_at
  from public.store_order_guest_access access
  where access.order_id = v_order_id
  for update;

  -- The per-order cooldown complements the IP limit and bounds email abuse
  -- even when requests are distributed across addresses.
  if found and v_last_issued_at > now() - interval '15 minutes' then
    return false;
  end if;

  insert into public.store_order_guest_access as access (
    order_id, nonce, token_version, expires_at, revoked_at, last_issued_at
  ) values (
    v_order_id,
    extensions.gen_random_uuid(),
    1,
    now() + interval '30 days',
    null,
    now()
  )
  on conflict (order_id) do update
  set nonce = case
        when access.revoked_at is not null or access.expires_at <= now()
          then extensions.gen_random_uuid()
        else access.nonce
      end,
      token_version = access.token_version + 1,
      expires_at = now() + interval '30 days',
      revoked_at = null,
      last_issued_at = now(),
      updated_at = now()
  returning access.token_version into v_token_version;

  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key
  ) values (
    'order.received',
    v_order_id,
    v_email,
    jsonb_build_object(
      'order_number', upper(trim(p_order_number)),
      'customer_name', v_customer_name,
      'total_minor', v_total_minor,
      'access_reissued', true,
      'guest_access_version', v_token_version
    ),
    'order.received:' || v_order_id::text || ':v' || v_token_version::text
  );

  return true;
end;
$$;

revoke all on function public.create_store_order_v2(jsonb, jsonb, jsonb)
  from public, anon, authenticated;
revoke all on function public.claim_expired_store_reservations(integer)
  from public, anon, authenticated;
revoke all on function public.defer_store_order_reservation(uuid, uuid, uuid, integer, text, boolean)
  from public, anon, authenticated;
revoke all on function public.mark_store_order_reservation_review(uuid, uuid, uuid, text)
  from public, anon, authenticated;
revoke all on function public.flag_store_order_payment_review(uuid, uuid, text)
  from public, anon, authenticated;
revoke all on function public.expire_store_order_reservation(uuid, uuid, uuid, text)
  from public, anon, authenticated;
revoke all on function public.release_store_order_inventory_v2(uuid, uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.resolve_store_order_payment_review(
  uuid, uuid, text, text, text, text
) from public, anon, authenticated;
revoke all on function public.get_store_guest_tracking(uuid, uuid)
  from public, anon, authenticated;
revoke all on function public.queue_store_guest_access_reissue(text, text)
  from public, anon, authenticated;
revoke all on function public.ingest_and_apply_openpay_event(
  text, text, text, uuid, uuid, jsonb, bigint, text, text, jsonb, text
) from public, anon, authenticated;
revoke all on function public.apply_openpay_event(
  bigint, text, text, uuid, bigint, text, text, jsonb, text
) from public, anon, authenticated, service_role;
revoke all on function public.claim_store_outbox_events(integer)
  from public, anon, authenticated;
revoke all on function public.complete_store_outbox_event(bigint, uuid, text)
  from public, anon, authenticated;
revoke all on function public.fail_store_outbox_event(bigint, uuid, text, integer)
  from public, anon, authenticated;

grant execute on function public.create_store_order_v2(jsonb, jsonb, jsonb)
  to service_role;
grant execute on function public.claim_expired_store_reservations(integer)
  to service_role;
grant execute on function public.defer_store_order_reservation(uuid, uuid, uuid, integer, text, boolean)
  to service_role;
grant execute on function public.mark_store_order_reservation_review(uuid, uuid, uuid, text)
  to service_role;
grant execute on function public.flag_store_order_payment_review(uuid, uuid, text)
  to service_role;
grant execute on function public.expire_store_order_reservation(uuid, uuid, uuid, text)
  to service_role;
grant execute on function public.release_store_order_inventory_v2(uuid, uuid, text, text)
  to service_role;
grant execute on function public.resolve_store_order_payment_review(
  uuid, uuid, text, text, text, text
) to service_role;
grant execute on function public.get_store_guest_tracking(uuid, uuid)
  to service_role;
grant execute on function public.queue_store_guest_access_reissue(text, text)
  to service_role;
grant execute on function public.ingest_and_apply_openpay_event(
  text, text, text, uuid, uuid, jsonb, bigint, text, text, jsonb, text
) to service_role;
grant execute on function public.claim_store_outbox_events(integer)
  to service_role;
grant execute on function public.complete_store_outbox_event(bigint, uuid, text)
  to service_role;
grant execute on function public.fail_store_outbox_event(bigint, uuid, text, integer)
  to service_role;

-- The service key must use the guarded v2 entry points. Their SECURITY DEFINER
-- owners retain the ability to call the internal v1 function.
revoke execute on function public.create_store_order(jsonb, jsonb, jsonb)
  from service_role;
revoke execute on function public.release_store_order_inventory(uuid, text, text)
  from service_role;
revoke execute on function public.apply_openpay_event_v1_internal(
  bigint, text, text, uuid, bigint, text, text, jsonb, text
) from service_role;
revoke execute on function public.complete_store_outbox_event(bigint, text)
  from service_role;
revoke execute on function public.fail_store_outbox_event(bigint, text, integer)
  from service_role;
revoke all on function public.normalize_store_reservation_state()
  from public, anon, authenticated, service_role;

commit;
