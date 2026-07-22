-- Append-only evidence of the legal documents accepted by authenticated
-- storefront users. Purchase consent for guest and authenticated checkouts is
-- also snapshotted on each store_orders.metadata object by the API.
create table public.store_legal_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (
    document_type in ('privacy_notice', 'account_terms')
  ),
  document_version text not null check (
    char_length(document_version) between 8 and 80
    and document_version ~ '^[a-z0-9][a-z0-9._-]+$'
  ),
  document_sha256 char(64) not null check (
    document_sha256 ~ '^[a-f0-9]{64}$'
  ),
  provider_snapshot jsonb not null check (
    jsonb_typeof(provider_snapshot) = 'object'
    and provider_snapshot ?& array[
      'holder_name', 'trade_name', 'ruc', 'address', 'email', 'phone'
    ]
  ),
  source text not null default 'account_onboarding' check (
    source = 'account_onboarding'
  ),
  locale text not null default 'es-PE' check (locale = 'es-PE'),
  accepted_at timestamptz not null default now(),
  unique (user_id, document_type, document_version, document_sha256)
);

create index store_legal_acceptances_user_idx
  on public.store_legal_acceptances (user_id, accepted_at desc);

alter table public.store_legal_acceptances enable row level security;

revoke all on table public.store_legal_acceptances
  from public, anon, authenticated;
revoke all on sequence public.store_legal_acceptances_id_seq
  from public, anon, authenticated;

grant select on table public.store_legal_acceptances to authenticated;

grant select, insert on table public.store_legal_acceptances to service_role;
grant usage, select on sequence public.store_legal_acceptances_id_seq
  to service_role;

create policy "legal_acceptances_select_own"
  on public.store_legal_acceptances
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

comment on table public.store_legal_acceptances is
  'Append-only account consent written only by the trusted storefront server after user and MFA validation. Rows intentionally cascade on account deletion for privacy minimization; transaction consent remains independently snapshotted in store_orders.metadata.';
