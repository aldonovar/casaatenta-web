alter table public.email_events
  add column alert_status text
    check (
      alert_status is null or
      alert_status in ('pending', 'processing', 'failed', 'sent')
    ),
  add column alert_attempt_count integer not null default 0
    check (alert_attempt_count between 0 and 5),
  add column alert_claimed_at timestamptz,
  add column alert_detail text
    check (
      alert_detail is null or (
        char_length(alert_detail) between 1 and 300 and
        alert_detail !~ '[[:cntrl:]]'
      )
    ),
  add column alert_retry_after timestamptz,
  add column alert_resend_email_id text
    check (
      alert_resend_email_id is null or
      char_length(alert_resend_email_id) between 1 and 200
    ),
  add column alert_last_error text
    check (
      alert_last_error is null or (
        char_length(alert_last_error) between 1 and 300 and
        alert_last_error !~ '[[:cntrl:]]'
      )
    ),
  add column alert_sent_at timestamptz,
  add constraint email_events_alert_payload_check
    check (alert_status is null or alert_detail is not null),
  add constraint email_events_alert_processing_check
    check (alert_status <> 'processing' or alert_claimed_at is not null),
  add constraint email_events_alert_sent_check
    check (
      alert_status <> 'sent' or (
        alert_resend_email_id is not null and
        alert_sent_at is not null
      )
    );

comment on column public.email_events.alert_status is
  'Durable outbox state for internal delivery-incident alerts; null for events that require no alert.';

create index email_events_alert_retry_idx
  on public.email_events (alert_status, alert_retry_after, alert_claimed_at)
  where alert_status in ('pending', 'processing', 'failed');
