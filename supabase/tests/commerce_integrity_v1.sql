begin;

create extension if not exists pgtap with schema extensions;

select plan(74);

select has_column(
  'public', 'store_orders', 'reservation_reconcile_token',
  'orders have an identity-bearing reconciliation lease'
);
select has_column(
  'public', 'store_orders', 'reservation_reconcile_payment_id',
  'the lease is bound to an exact payment attempt'
);
select has_column(
  'public', 'store_orders', 'reservation_provider_not_found_count',
  'provider absence is counted separately from transport errors'
);
select has_column(
  'public', 'store_order_guest_access', 'last_issued_at',
  'guest access issuance has a dedicated cooldown timestamp'
);
select ok(
  to_regclass('public.store_payments_one_unresolved_per_order') is not null,
  'only one unresolved payment attempt is allowed per order'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.store_order_guest_access'::regclass),
  'guest access table has RLS enabled'
);
select ok(
  not has_function_privilege(
    'service_role',
    'public.create_store_order(jsonb,jsonb,jsonb)',
    'execute'
  ),
  'service role cannot bypass the v2 checkout wrapper'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.create_store_order_v2(jsonb,jsonb,jsonb)',
    'execute'
  ),
  'service role can execute the guarded v2 checkout wrapper'
);
select has_column(
  'public', 'store_outbox_events', 'claim_token',
  'outbox work has an identity-bearing lease'
);
select ok(
  not has_function_privilege(
    'service_role',
    'public.complete_store_outbox_event(bigint,text)',
    'execute'
  ),
  'service role cannot complete outbox work without a lease token'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.complete_store_outbox_event(bigint,uuid,text)',
    'execute'
  ),
  'service role can complete outbox work with the exact lease token'
);
select ok(
  not has_function_privilege(
    'service_role',
    'public.fail_store_outbox_event(bigint,text,integer)',
    'execute'
  ),
  'service role cannot fail outbox work without a lease token'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.fail_store_outbox_event(bigint,uuid,text,integer)',
    'execute'
  ),
  'service role can fail outbox work with the exact lease token'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.ingest_and_apply_openpay_event(text,text,text,uuid,uuid,jsonb,bigint,text,text,jsonb,text)',
    'execute'
  ),
  'service role uses the atomic provider ingestion boundary'
);
select ok(
  not has_function_privilege(
    'service_role',
    'public.apply_openpay_event_v1_internal(bigint,text,text,uuid,bigint,text,text,jsonb,text)',
    'execute'
  ),
  'service role cannot bypass atomic provider ingestion'
);
select ok(
  not has_function_privilege(
    'service_role',
    'public.apply_openpay_event(bigint,text,text,uuid,bigint,text,text,jsonb,text)',
    'execute'
  ),
  'service role cannot call the non-ingesting provider transition wrapper'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.resolve_store_order_payment_review(uuid,uuid,text,text,text,text)',
    'execute'
  ),
  'service role has the explicit audited review-resolution RPC'
);

create temporary table outbox_test_context (
  scenario text primary key,
  event_id bigint not null
);

with inserted as (
  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key,
    available_at
  ) values (
    'order.received', extensions.gen_random_uuid(), 'outbox@example.com',
    '{}'::jsonb, 'commerce-test-outbox-complete', now() - interval '1 minute'
  )
  returning id
)
insert into outbox_test_context select 'complete', id from inserted;

create temporary table outbox_complete_claim as
select * from public.claim_store_outbox_events(1);

select ok(
  (select claim_token is not null
     and id = (select event_id from outbox_test_context where scenario = 'complete')
   from outbox_complete_claim),
  'outbox claim returns a token bound to the selected event'
);
select ok(
  not public.complete_store_outbox_event(
    (select event_id from outbox_test_context where scenario = 'complete'),
    extensions.gen_random_uuid(),
    'stale-worker'
  ),
  'a stale worker cannot complete another outbox lease'
);
select ok(
  public.complete_store_outbox_event(
    (select event_id from outbox_test_context where scenario = 'complete'),
    (select claim_token from outbox_complete_claim),
    'provider-message-test'
  ),
  'the active worker can complete its outbox lease'
);
select ok(
  (select processed_at is not null and claim_token is null and locked_at is null
   from public.store_outbox_events
   where id = (select event_id from outbox_test_context where scenario = 'complete')),
  'completion atomically clears the outbox lease'
);

with inserted as (
  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key,
    available_at
  ) values (
    'order.received', extensions.gen_random_uuid(), 'outbox@example.com',
    '{}'::jsonb, 'commerce-test-outbox-fail', now() - interval '1 minute'
  )
  returning id
)
insert into outbox_test_context select 'fail', id from inserted;

create temporary table outbox_fail_claim as
select * from public.claim_store_outbox_events(1);

select ok(
  not public.fail_store_outbox_event(
    (select event_id from outbox_test_context where scenario = 'fail'),
    extensions.gen_random_uuid(),
    'stale worker',
    300
  ),
  'a stale worker cannot fail another outbox lease'
);
select ok(
  public.fail_store_outbox_event(
    (select event_id from outbox_test_context where scenario = 'fail'),
    (select claim_token from outbox_fail_claim),
    'provider unavailable',
    300
  ),
  'the active worker can defer its outbox lease'
);
select ok(
  (select processed_at is null and claim_token is null and locked_at is null
          and available_at > now()
   from public.store_outbox_events
   where id = (select event_id from outbox_test_context where scenario = 'fail')),
  'outbox failure clears the lease and schedules a bounded retry'
);

create temporary table commerce_test_context (
  scenario text primary key,
  order_id uuid not null,
  payment_id uuid not null,
  product_id uuid not null
);

create or replace function pg_temp.create_reserved_order(
  p_scenario text,
  p_payment_state text default 'pending',
  p_external_id text default null
)
returns void
language plpgsql
as $$
declare
  v_order_id uuid;
  v_payment_id uuid;
  v_product_id uuid;
  v_sku text;
  v_name text;
begin
  select product.id, product.sku, product.name
  into v_product_id, v_sku, v_name
  from public.store_products product
  order by product.id
  limit 1;

  if v_product_id is null then
    raise exception 'commerce test requires one seeded product';
  end if;

  update public.store_products
  set stock_quantity = 10
  where id = v_product_id;

  insert into public.store_orders (
    email, phone, customer_name, document_type, document_number,
    order_state, payment_state, subtotal_minor, tax_minor, total_minor,
    idempotency_key, inventory_reserved, reservation_expires_at
  ) values (
    p_scenario || '@example.com', '+51999999999', 'Commerce Test', 'DNI',
    '12345678', 'payment_pending', p_payment_state, 10000, 1525, 10000,
    'commerce-test-' || p_scenario || '-123456', true, now() - interval '1 minute'
  )
  returning id into v_order_id;

  insert into public.store_payments (
    order_id, external_id, state, amount_minor
  ) values (
    v_order_id, p_external_id, p_payment_state, 10000
  )
  returning id into v_payment_id;

  insert into public.store_order_items (
    order_id, product_id, sku, name, quantity, unit_price_minor,
    total_minor, product_snapshot
  ) values (
    v_order_id, v_product_id, v_sku, v_name, 1, 10000, 10000, '{}'::jsonb
  );

  update public.store_products
  set stock_quantity = 9
  where id = v_product_id;

  insert into commerce_test_context (scenario, order_id, payment_id, product_id)
  values (p_scenario, v_order_id, v_payment_id, v_product_id);
end;
$$;

select pg_temp.create_reserved_order('expiry');
create temporary table expiry_claim_one as
select * from public.claim_expired_store_reservations(1);

select ok(
  (select lease_token is not null
     and payment_id = (select payment_id from commerce_test_context where scenario = 'expiry')
   from expiry_claim_one),
  'claim returns a non-null lease bound to the expected payment'
);
select is(
  public.expire_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'expiry'),
    (select payment_id from commerce_test_context where scenario = 'expiry'),
    (select lease_token from expiry_claim_one),
    'provider_not_found_test'
  ),
  'grace_required'::text,
  'the first confirmed empty lookup preserves inventory'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'expiry')),
  9,
  'inventory remains reserved after the first empty lookup'
);
select is(
  (select reservation_provider_not_found_count from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'expiry')),
  1,
  'only the confirmed empty lookup advances the absence counter'
);
select is(
  public.expire_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'expiry'),
    (select payment_id from commerce_test_context where scenario = 'expiry'),
    (select lease_token from expiry_claim_one),
    'stale_worker'
  ),
  'lease_lost'::text,
  'a stale worker cannot reuse an old lease'
);

update public.store_orders
set reservation_expires_at = now() - interval '1 minute'
where id = (select order_id from commerce_test_context where scenario = 'expiry');
create temporary table expiry_claim_two as
select * from public.claim_expired_store_reservations(1);

select isnt(
  (select lease_token from expiry_claim_two),
  (select lease_token from expiry_claim_one),
  'a new claim receives a different lease identity'
);
select is(
  public.expire_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'expiry'),
    (select payment_id from commerce_test_context where scenario = 'expiry'),
    (select lease_token from expiry_claim_two),
    'provider_not_found_test'
  ),
  'expired'::text,
  'the second separately confirmed empty lookup expires the reservation'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'expiry')),
  10,
  'inventory is restored exactly once after safe expiry'
);
select is(
  (select order_state from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'expiry')),
  'cancelled'::text,
  'safe expiry cancels the pending order'
);

select pg_temp.create_reserved_order('evidence', 'pending', 'charge-evidence');
create temporary table evidence_claim as
select * from public.claim_expired_store_reservations(1);

select ok(
  (select lease_token is not null from evidence_claim),
  'an evidence scenario can be claimed for reconciliation'
);
select is(
  public.expire_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'evidence'),
    (select payment_id from commerce_test_context where scenario = 'evidence'),
    (select lease_token from evidence_claim),
    'provider_empty_with_evidence'
  ),
  'needs_review'::text,
  'provider evidence forbids automatic expiry'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'evidence')),
  9,
  'inventory remains reserved when provider evidence exists'
);
select is(
  (select reservation_provider_not_found_count from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'evidence')),
  0,
  'evidence does not count as provider absence'
);

select pg_temp.create_reserved_order('defer');
create temporary table defer_claim as
select * from public.claim_expired_store_reservations(1);

select ok(
  (select lease_token is not null from defer_claim),
  'a transport-error scenario can be claimed'
);
select is(
  public.defer_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'defer'),
    (select payment_id from commerce_test_context where scenario = 'defer'),
    extensions.gen_random_uuid(),
    300,
    'stale worker',
    false
  ),
  'lease_lost'::text,
  'defer rejects a worker that does not own the lease'
);
select is(
  public.defer_store_order_reservation(
    (select order_id from commerce_test_context where scenario = 'defer'),
    (select payment_id from commerce_test_context where scenario = 'defer'),
    (select lease_token from defer_claim),
    300,
    'network timeout',
    false
  ),
  'retry'::text,
  'the active lease can safely defer a transport error'
);
select is(
  (select reservation_provider_not_found_count from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'defer')),
  0,
  'transport errors never advance provider-absence count'
);
select is(
  (select reservation_reconcile_state from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'defer')),
  'retry'::text,
  'a safely deferred reservation returns to retry state'
);

create temporary table unknown_payment_reference as
select extensions.gen_random_uuid() as payment_id;
select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-unknown-payment-reference',
    'provider_payload.invalid',
    'charge-unknown-payment-reference',
    (select payment_id from unknown_payment_reference),
    null,
    '{"validation":{"payment_attempt_valid":true}}'::jsonb,
    null,
    null,
    null,
    '{}'::jsonb,
    null
  ) ->> 'status',
  'event_recorded_no_state_change'::text,
  'a syntactically valid but nonexistent provider payment UUID is quarantined safely'
);
select is(
  (select payment_id
   from public.store_payment_events
   where event_key = 'commerce-test-unknown-payment-reference'),
  null::uuid,
  'quarantine never writes an unverified UUID into the payment foreign key'
);

select pg_temp.create_reserved_order('atomic-ingest');

select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-atomic-pending',
    'charge.pending',
    'charge-atomic-ingest',
    (select payment_id from commerce_test_context where scenario = 'atomic-ingest'),
    (select order_id from commerce_test_context where scenario = 'atomic-ingest'),
    '{"status":"pending"}'::jsonb,
    10000,
    'PEN',
    null,
    '{}'::jsonb,
    null
  ) ->> 'status',
  'event_recorded_no_state_change'::text,
  'provider evidence is ingested and applied through one transaction'
);
select is(
  (select count(*)::integer
   from public.store_payment_events event
   where event.event_key = 'commerce-test-atomic-pending'
     and event.payment_id =
       (select payment_id from commerce_test_context where scenario = 'atomic-ingest')
     and event.order_id =
       (select order_id from commerce_test_context where scenario = 'atomic-ingest')
     and event.processed_at is not null),
  1,
  'the committed provider event is already linked and processed'
);
select pg_temp.create_reserved_order('unknown-ingest');
select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-atomic-unknown',
    'charge.future_provider_state',
    'charge-future-untrusted',
    (select payment_id from commerce_test_context where scenario = 'unknown-ingest'),
    (select order_id from commerce_test_context where scenario = 'unknown-ingest'),
    '{"status":"future_provider_state"}'::jsonb,
    10000,
    'PEN',
    null,
    '{}'::jsonb,
    null
  ) ->> 'status',
  'event_recorded_no_state_change'::text,
  'a future provider event is durably recorded instead of causing an infinite retry loop'
);
select is(
  (select reservation_reconcile_state
   from public.store_orders
   where id = (select order_id from commerce_test_context where scenario = 'unknown-ingest')),
  'needs_review'::text,
  'an unknown provider event opens a visible review case without mutating payment state'
);
select is(
  (select external_id
   from public.store_payments
   where id = (select payment_id from commerce_test_context where scenario = 'unknown-ingest')),
  null::text,
  'quarantined provider evidence never poisons the trusted external payment binding'
);
select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-atomic-mismatch',
    'charge.succeeded',
    'charge-atomic-ingest',
    (select payment_id from commerce_test_context where scenario = 'atomic-ingest'),
    (select order_id from commerce_test_context where scenario = 'atomic-ingest'),
    '{"status":"completed"}'::jsonb,
    9999,
    'PEN',
    'AUTH-TEST',
    '{}'::jsonb,
    null
  ) ->> 'status',
  'rejected_amount_or_currency'::text,
  'an amount mismatch is rejected inside the atomic ingestion boundary'
);
select is(
  (select reservation_reconcile_state
   from public.store_orders
   where id = (select order_id from commerce_test_context where scenario = 'atomic-ingest')),
  'needs_review'::text,
  'an atomic provider mismatch opens a visible operational review case'
);

select pg_temp.create_reserved_order('missing-currency');
select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-missing-currency',
    'charge.succeeded',
    'charge-missing-currency',
    (select payment_id from commerce_test_context where scenario = 'missing-currency'),
    (select order_id from commerce_test_context where scenario = 'missing-currency'),
    '{"status":"completed"}'::jsonb,
    10000,
    null,
    'AUTH-MISSING-CURRENCY',
    '{}'::jsonb,
    null
  ) ->> 'status',
  'processed'::text,
  'a legitimate Openpay success without currency uses the authoritative local PEN attempt'
);
select is(
  (select state from public.store_payments where id =
    (select payment_id from commerce_test_context where scenario = 'missing-currency')),
  'paid'::text,
  'a currency-omitting success still confirms the exact local payment'
);

select pg_temp.create_reserved_order('unsupported-local-currency');
update public.store_payments
set currency = 'USD'
where id = (select payment_id from commerce_test_context where scenario = 'unsupported-local-currency');
select is(
  public.ingest_and_apply_openpay_event(
    'commerce-test-unsupported-local-currency',
    'charge.succeeded',
    'charge-unsupported-local-currency',
    (select payment_id from commerce_test_context where scenario = 'unsupported-local-currency'),
    (select order_id from commerce_test_context where scenario = 'unsupported-local-currency'),
    '{"status":"completed"}'::jsonb,
    10000,
    null,
    'AUTH-UNSUPPORTED-CURRENCY',
    '{}'::jsonb,
    null
  ) ->> 'status',
  'rejected_amount_or_currency'::text,
  'an omitted provider currency never bypasses the local PEN-only boundary'
);
select is(
  (select state from public.store_payments where id =
    (select payment_id from commerce_test_context where scenario = 'unsupported-local-currency')),
  'pending'::text,
  'a non-PEN local attempt remains financially unchanged for manual review'
);
select is(
  public.mark_store_order_reservation_review(
    (select order_id from commerce_test_context where scenario = 'atomic-ingest'),
    (select payment_id from commerce_test_context where scenario = 'atomic-ingest'),
    extensions.gen_random_uuid(),
    'already raised by ingestion'
  ),
  'already_review'::text,
  'a worker reports the authoritative review state after ingestion clears its lease'
);
select is(
  public.resolve_store_order_payment_review(
    (select order_id from commerce_test_context where scenario = 'atomic-ingest'),
    (select payment_id from commerce_test_context where scenario = 'atomic-ingest'),
    'cancel_no_charge',
    'OPENPAY-CASE-NO-CHARGE',
    'commerce-test-operator',
    'Openpay sandbox confirmed that no charge exists for this attempt.'
  ),
  'cancelled'::text,
  'the explicit staff RPC resolves a reviewed no-charge case'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'atomic-ingest')),
  10,
  'manual no-charge resolution restores inventory exactly once'
);
select is(
  (select count(*)::integer
   from public.store_payment_review_audits audit
   where audit.order_id =
       (select order_id from commerce_test_context where scenario = 'atomic-ingest')),
  1,
  'manual review resolution records actor, evidence and decision in audit logs'
);

select pg_temp.create_reserved_order('advanced-paid', 'paid', 'charge-advanced-paid');
update public.store_orders
set order_state = 'shipped',
    payment_state = 'paid',
    inventory_reserved = false,
    paid_at = now()
where id = (select order_id from commerce_test_context where scenario = 'advanced-paid');
update public.store_orders
set reservation_reconcile_state = 'needs_review'
where id = (select order_id from commerce_test_context where scenario = 'advanced-paid');

select is(
  public.resolve_store_order_payment_review(
    (select order_id from commerce_test_context where scenario = 'advanced-paid'),
    (select payment_id from commerce_test_context where scenario = 'advanced-paid'),
    'confirm_paid',
    'charge-advanced-paid',
    'commerce-test-operator',
    'Openpay confirmed the paid shipment while operations preserved fulfilment.'
  ),
  'confirmed'::text,
  'a paid order that already advanced can close its review safely'
);
select is(
  (select order_state from public.store_orders where id =
    (select order_id from commerce_test_context where scenario = 'advanced-paid')),
  'shipped'::text,
  'manual payment review preserves the advanced fulfilment state'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'advanced-paid')),
  9,
  'resolving an already-paid advanced order never consumes stock twice'
);
select is(
  (select after_snapshot ->> 'order_state'
   from public.store_payment_review_audits
   where order_id =
     (select order_id from commerce_test_context where scenario = 'advanced-paid')),
  'shipped'::text,
  'the payment-review audit records the preserved operational state'
);

select pg_temp.create_reserved_order('terminal-review', 'refunded', 'charge-terminal-review');
update public.store_orders
set order_state = 'delivered',
    payment_state = 'refunded',
    inventory_reserved = false,
    paid_at = now()
where id = (select order_id from commerce_test_context where scenario = 'terminal-review');
update public.store_orders
set reservation_reconcile_state = 'needs_review'
where id = (select order_id from commerce_test_context where scenario = 'terminal-review');

select is(
  public.resolve_store_order_payment_review(
    (select order_id from commerce_test_context where scenario = 'terminal-review'),
    (select payment_id from commerce_test_context where scenario = 'terminal-review'),
    'acknowledge_no_change',
    'charge-terminal-review',
    'commerce-test-operator',
    'Openpay evidence was reviewed and the terminal refund remains authoritative.'
  ),
  'acknowledged'::text,
  'a terminal payment review can be closed without a financial transition'
);
select is(
  (select order_state || ':' || payment_state
   from public.store_orders
   where id = (select order_id from commerce_test_context where scenario = 'terminal-review')),
  'delivered:refunded'::text,
  'acknowledgement preserves the terminal order and payment states'
);
select is(
  (select stock_quantity from public.store_products where id =
    (select product_id from commerce_test_context where scenario = 'terminal-review')),
  9,
  'acknowledgement never changes terminal-order inventory'
);
select is(
  (select resolution
   from public.store_payment_review_audits
   where order_id =
     (select order_id from commerce_test_context where scenario = 'terminal-review')),
  'acknowledge_no_change'::text,
  'the no-change resolution is recorded in the dedicated audit ledger'
);

insert into public.store_orders (
  email, phone, customer_name, document_type, document_number,
  order_state, payment_state, subtotal_minor, tax_minor, total_minor,
  idempotency_key, inventory_reserved, reservation_expires_at
) values (
  'guest-reissue@example.com', '+51999999999', 'Guest Reissue Test', 'DNI',
  '12345678', 'cancelled', 'failed', 10000, 1525, 10000,
  'commerce-test-guest-reissue-123456', false, null
);

select ok(
  public.queue_store_guest_access_reissue(
    (select order_number from public.store_orders where idempotency_key =
      'commerce-test-guest-reissue-123456'),
    'guest-reissue@example.com'
  ),
  'verified guest identity atomically queues the first access email'
);
select ok(
  not public.queue_store_guest_access_reissue(
    (select order_number from public.store_orders where idempotency_key =
      'commerce-test-guest-reissue-123456'),
    'guest-reissue@example.com'
  ),
  'per-order cooldown blocks immediate link invalidation and mail bombing'
);
select is(
  (select token_version from public.store_order_guest_access where order_id =
    (select id from public.store_orders where idempotency_key =
      'commerce-test-guest-reissue-123456')),
  1,
  'cooldown leaves the active guest token version unchanged'
);
select is(
  (select count(*)::integer from public.store_outbox_events where idempotency_key like
    'order.received:%:v1'),
  1,
  'guest reissue and email enqueue commit as one event'
);

create temporary table guest_nonce_before as
select access.order_id, access.nonce
from public.store_order_guest_access access
where access.order_id = (
  select id from public.store_orders
  where idempotency_key = 'commerce-test-guest-reissue-123456'
);

update public.store_order_guest_access
set last_issued_at = now() - interval '16 minutes'
where order_id = (select order_id from guest_nonce_before);

select ok(
  public.queue_store_guest_access_reissue(
    (select order_number from public.store_orders where idempotency_key =
      'commerce-test-guest-reissue-123456'),
    'guest-reissue@example.com'
  ),
  'an access email can be renewed after the persistent cooldown'
);
select is(
  (select access.nonce
   from public.store_order_guest_access access
   where access.order_id = (select order_id from guest_nonce_before)),
  (select nonce from guest_nonce_before),
  'renewal keeps an active nonce so an attacker cannot invalidate prior links'
);
select is(
  (select token_version from public.store_order_guest_access where order_id =
    (select order_id from guest_nonce_before)),
  2,
  'renewal advances delivery version without revoking active links'
);

select * from finish();

rollback;
