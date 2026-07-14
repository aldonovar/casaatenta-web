create extension if not exists pgcrypto with schema extensions;

create sequence if not exists public.consumer_claim_code_seq;

create table if not exists public.contact_submissions (
  id uuid primary key default extensions.gen_random_uuid(),
  source text not null check (source in ('contact', 'quote', 'configurator')),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254 and email = lower(email)),
  phone text not null check (char_length(phone) between 7 and 30),
  service text check (service is null or char_length(service) <= 120),
  location text check (location is null or char_length(location) <= 160),
  measures text check (measures is null or char_length(measures) <= 240),
  message text check (message is null or char_length(message) <= 4000),
  project_data jsonb not null default '{}'::jsonb,
  request_fingerprint text check (request_fingerprint is null or char_length(request_fingerprint) = 64),
  turnstile_hostname text,
  privacy_consent_at timestamptz not null,
  privacy_consent_version text not null default 'privacy-2026-07-13',
  status text not null default 'received' check (status in ('received', 'notified', 'email_failed', 'closed')),
  resend_notification_id text,
  resend_confirmation_id text,
  email_retry_count integer not null default 0 check (email_retry_count between 0 and 10),
  email_retry_after timestamptz default now(),
  last_email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consumer_claims (
  id uuid primary key default extensions.gen_random_uuid(),
  code text not null unique default (
    'CA-REC-' || to_char(timezone('America/Lima', now()), 'YYYY') || '-' ||
    lpad(nextval('public.consumer_claim_code_seq')::text, 6, '0')
  ),
  full_name text not null check (char_length(full_name) between 2 and 160),
  document_type text not null check (document_type in ('DNI', 'CE', 'RUC', 'Pasaporte')),
  document_number text not null check (char_length(document_number) between 5 and 20),
  email text not null check (char_length(email) between 5 and 254 and email = lower(email)),
  phone text not null check (char_length(phone) between 7 and 30),
  address text not null check (char_length(address) between 5 and 300),
  is_minor boolean not null default false,
  minor_guardian text check (minor_guardian is null or char_length(minor_guardian) <= 160),
  minor_guardian_address text check (minor_guardian_address is null or char_length(minor_guardian_address) <= 300),
  minor_guardian_phone text check (minor_guardian_phone is null or char_length(minor_guardian_phone) between 7 and 30),
  minor_guardian_email text check (minor_guardian_email is null or (char_length(minor_guardian_email) between 5 and 254 and minor_guardian_email = lower(minor_guardian_email))),
  constraint consumer_claims_minor_guardian_required check (
    not is_minor or (
      nullif(btrim(minor_guardian), '') is not null and
      nullif(btrim(minor_guardian_address), '') is not null and
      nullif(btrim(minor_guardian_phone), '') is not null and
      nullif(btrim(minor_guardian_email), '') is not null
    )
  ),
  claim_type text not null check (claim_type in ('Reclamo', 'Queja')),
  good_type text not null check (good_type in ('Producto', 'Servicio')),
  product_description text not null check (char_length(product_description) between 3 and 500),
  claimed_amount numeric(12, 2) check (claimed_amount is null or claimed_amount >= 0),
  claim_detail text not null check (char_length(claim_detail) between 10 and 6000),
  consumer_request text not null check (char_length(consumer_request) between 5 and 4000),
  request_fingerprint text check (request_fingerprint is null or char_length(request_fingerprint) = 64),
  turnstile_hostname text,
  privacy_consent_at timestamptz not null,
  privacy_consent_version text not null default 'privacy-2026-07-13',
  claim_terms_consent_at timestamptz not null,
  claim_terms_version text not null default 'claim-terms-2026-07-13',
  status text not null default 'received' check (status in ('received', 'notified', 'email_failed', 'in_review', 'resolved')),
  provider_observations text check (provider_observations is null or char_length(provider_observations) <= 6000),
  provider_response_communicated_at timestamptz,
  provider_response_reference text check (provider_response_reference is null or char_length(provider_response_reference) <= 500),
  resend_notification_id text,
  resend_receipt_id text,
  email_retry_count integer not null default 0 check (email_retry_count between 0 and 10),
  email_retry_after timestamptz default now(),
  last_email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null unique check (char_length(email) between 5 and 254 and email = lower(email)),
  name text check (name is null or char_length(name) <= 120),
  source text not null default 'website' check (char_length(source) <= 80),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed', 'suppressed')),
  consent_at timestamptz not null,
  consent_version text not null default 'privacy-2026-07-13',
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  confirmation_token_hash text unique check (confirmation_token_hash is null or char_length(confirmation_token_hash) = 64),
  confirmation_expires_at timestamptz,
  suppression_reason text,
  resend_confirmation_id text,
  resend_welcome_id text,
  email_retry_count integer not null default 0 check (email_retry_count between 0 and 10),
  email_retry_after timestamptz default now(),
  last_email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_consent_events (
  id uuid primary key default extensions.gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers(id),
  event_type text not null check (event_type in ('requested', 'confirmed', 'unsubscribed', 'suppressed')),
  consent_version text not null,
  request_fingerprint text check (request_fingerprint is null or char_length(request_fingerprint) = 64),
  source_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default extensions.gen_random_uuid(),
  svix_id text not null unique,
  event_type text not null,
  email_id text,
  recipient_email text,
  payload jsonb not null,
  event_created_at timestamptz,
  received_at timestamptz not null default now()
);

create table if not exists public.submission_rate_limits (
  fingerprint text not null check (char_length(fingerprint) = 64),
  scope text not null check (char_length(scope) <= 80),
  window_started_at timestamptz not null default now(),
  attempt_count integer not null default 1 check (attempt_count > 0),
  primary key (fingerprint, scope)
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index if not exists consumer_claims_created_at_idx
  on public.consumer_claims (created_at desc);
create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status, created_at desc);
create index if not exists newsletter_consent_events_subscriber_idx
  on public.newsletter_consent_events (subscriber_id, created_at desc);
create unique index if not exists newsletter_consent_events_source_idx
  on public.newsletter_consent_events (subscriber_id, source_event_id)
  where source_event_id is not null;
create index if not exists email_events_email_id_idx
  on public.email_events (email_id, event_created_at desc);
create index if not exists email_events_received_at_idx
  on public.email_events (received_at desc);
create index if not exists submission_rate_limits_window_idx
  on public.submission_rate_limits (window_started_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_submissions_set_updated_at on public.contact_submissions;
create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

drop trigger if exists consumer_claims_set_updated_at on public.consumer_claims;
create trigger consumer_claims_set_updated_at
before update on public.consumer_claims
for each row execute function public.set_updated_at();

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

create or replace function public.check_submission_rate_limit(
  p_fingerprint text,
  p_scope text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_attempts integer;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit configuration';
  end if;

  -- La limpieza probabilística evita que fingerprints antiguos crezcan sin
  -- límite y mantiene el coste bajo en solicitudes normales.
  if random() < 0.02 then
    delete from public.submission_rate_limits
    where window_started_at < now() - interval '7 days';
  end if;

  insert into public.submission_rate_limits as limits (
    fingerprint,
    scope,
    window_started_at,
    attempt_count
  ) values (
    p_fingerprint,
    p_scope,
    now(),
    1
  )
  on conflict (fingerprint, scope) do update
  set
    window_started_at = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else limits.window_started_at
    end,
    attempt_count = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else limits.attempt_count + 1
    end
  returning attempt_count into current_attempts;

  return current_attempts <= p_limit;
end;
$$;

alter table public.contact_submissions enable row level security;
alter table public.consumer_claims enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_consent_events enable row level security;
alter table public.email_events enable row level security;
alter table public.submission_rate_limits enable row level security;

revoke all on table public.contact_submissions from public, anon, authenticated, service_role;
revoke all on table public.consumer_claims from public, anon, authenticated, service_role;
revoke all on table public.newsletter_subscribers from public, anon, authenticated, service_role;
revoke all on table public.newsletter_consent_events from public, anon, authenticated, service_role;
revoke all on table public.email_events from public, anon, authenticated, service_role;
revoke all on table public.submission_rate_limits from public, anon, authenticated, service_role;
revoke all on sequence public.consumer_claim_code_seq from public, anon, authenticated, service_role;
revoke all on function public.set_updated_at() from public, anon, authenticated, service_role;
revoke all on function public.check_submission_rate_limit(text, text, integer, integer) from public, anon, authenticated, service_role;

grant select, insert, update on table public.contact_submissions to service_role;
grant select, insert, update on table public.consumer_claims to service_role;
grant select, insert, update on table public.newsletter_subscribers to service_role;
grant select, insert on table public.newsletter_consent_events to service_role;
grant update (request_fingerprint) on table public.newsletter_consent_events to service_role;
grant select, insert, update, delete on table public.email_events to service_role;
grant select, insert, update, delete on table public.submission_rate_limits to service_role;
grant usage, select on sequence public.consumer_claim_code_seq to service_role;
grant execute on function public.check_submission_rate_limit(text, text, integer, integer) to service_role;
