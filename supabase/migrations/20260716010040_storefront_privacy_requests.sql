create table public.store_privacy_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  requester_email text not null check (
    char_length(requester_email) between 5 and 254
    and requester_email = lower(requester_email)
  ),
  request_type text not null check (
    request_type in (
      'access', 'rectification', 'deletion', 'opposition',
      'revocation', 'portability'
    )
  ),
  details text not null default '' check (char_length(details) <= 4000),
  status text not null default 'received' check (
    status in ('received', 'identity_review', 'in_progress', 'completed', 'rejected', 'cancelled')
  ),
  resolution_note text check (
    resolution_note is null or char_length(resolution_note) <= 4000
  ),
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  updated_at timestamptz not null default now(),
  check (
    (status in ('completed', 'rejected', 'cancelled') and resolved_at is not null)
    or (status not in ('completed', 'rejected', 'cancelled') and resolved_at is null)
  )
);

create index store_privacy_requests_user_idx
  on public.store_privacy_requests (user_id, requested_at desc);
create index store_privacy_requests_queue_idx
  on public.store_privacy_requests (status, requested_at)
  where status in ('received', 'identity_review', 'in_progress');

create trigger store_privacy_requests_set_updated_at
before update on public.store_privacy_requests
for each row execute function public.set_updated_at();

alter table public.store_privacy_requests enable row level security;

revoke all on table public.store_privacy_requests
  from public, anon, authenticated;
grant select on table public.store_privacy_requests to authenticated;
grant all on table public.store_privacy_requests to service_role;

create policy "privacy_requests_select_own"
  on public.store_privacy_requests for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "privacy_requests_mfa_for_enrolled_users"
  on public.store_privacy_requests as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create or replace function public.submit_store_privacy_request(
  p_request_type text,
  p_details text default ''
)
returns table (request_id uuid, requested_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_email text := lower(coalesce((select auth.jwt() ->> 'email'), ''));
  v_request_id uuid;
  v_requested_at timestamptz;
begin
  if v_user_id is null or char_length(v_email) not between 5 and 254 then
    raise exception 'authentication_required';
  end if;

  if not (select public.store_session_meets_mfa_policy()) then
    raise exception 'mfa_required';
  end if;

  if p_request_type not in (
    'access', 'rectification', 'deletion', 'opposition',
    'revocation', 'portability'
  ) or char_length(coalesce(p_details, '')) > 4000 then
    raise exception 'invalid_privacy_request';
  end if;

  if (
    select count(*)
    from public.store_privacy_requests request
    where request.user_id = v_user_id
      and request.status in ('received', 'identity_review', 'in_progress')
  ) >= 5 then
    raise exception 'too_many_open_privacy_requests';
  end if;

  insert into public.store_privacy_requests (
    user_id, requester_email, request_type, details
  ) values (
    v_user_id,
    v_email,
    p_request_type,
    btrim(coalesce(p_details, ''))
  )
  returning id, public.store_privacy_requests.requested_at
  into v_request_id, v_requested_at;

  return query select v_request_id, v_requested_at;
end;
$$;

revoke all on function public.submit_store_privacy_request(text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.submit_store_privacy_request(text, text)
  to authenticated, service_role;

comment on table public.store_privacy_requests is
  'Operational queue for authenticated data-subject requests. Account deletion sets user_id null while retaining the request record for its controlled lifecycle.';
