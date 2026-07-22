-- If a customer has enrolled a verified MFA factor, an AAL1 session must not
-- reach private account data through PostgREST even if it bypasses the UI.
create or replace function public.store_session_meets_mfa_policy()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and (
      not exists (
        select 1
        from auth.mfa_factors factor
        where factor.user_id = (select auth.uid())
          and factor.status = 'verified'
      )
      or coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
    );
$$;

revoke all on function public.store_session_meets_mfa_policy()
  from public, anon, authenticated, service_role;
grant execute on function public.store_session_meets_mfa_policy()
  to authenticated, service_role;

create policy "profiles_mfa_for_enrolled_users"
  on public.store_profiles as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "addresses_mfa_for_enrolled_users"
  on public.customer_addresses as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "orders_mfa_for_enrolled_users"
  on public.store_orders as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "order_items_mfa_for_enrolled_users"
  on public.store_order_items as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "order_addresses_mfa_for_enrolled_users"
  on public.store_order_addresses as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "order_events_mfa_for_enrolled_users"
  on public.store_order_events as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "shipments_mfa_for_enrolled_users"
  on public.store_shipments as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "wishlists_mfa_for_enrolled_users"
  on public.customer_wishlists as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "wishlist_items_mfa_for_enrolled_users"
  on public.customer_wishlist_items as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

create policy "legal_acceptances_mfa_for_enrolled_users"
  on public.store_legal_acceptances as restrictive for all to authenticated
  using ((select public.store_session_meets_mfa_policy()))
  with check ((select public.store_session_meets_mfa_policy()));

comment on function public.store_session_meets_mfa_policy() is
  'Allows private storefront rows at AAL1 only until the current user enrolls a verified MFA factor.';
