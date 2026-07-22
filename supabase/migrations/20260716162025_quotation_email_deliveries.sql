create table public.quotation_email_deliveries (
  id uuid primary key default extensions.gen_random_uuid(),
  idempotency_key text not null unique
    check (idempotency_key ~ '^quotation-[0-9a-f]{64}$'),
  quotation_number text not null
    check (
      char_length(quotation_number) between 3 and 40 and
      quotation_number ~ '^[A-Za-z0-9-]+$'
    ),
  is_test boolean not null default false,
  recipient_masked text not null
    check (
      char_length(recipient_masked) between 7 and 254 and
      recipient_masked like '%***@%***%' and
      recipient_masked !~ '[[:space:]]'
    ),
  recipient_fingerprint text not null
    check (recipient_fingerprint ~ '^[0-9a-f]{64}$'),
  attachment_filename text not null
    check (
      char_length(attachment_filename) between 5 and 255 and
      attachment_filename = btrim(attachment_filename) and
      lower(attachment_filename) like '%.pdf'
    ),
  attachment_bytes bigint not null
    check (attachment_bytes between 1 and 4194304),
  status text not null default 'pending'
    check (
      status in (
        'pending',
        'sent',
        'delivered',
        'bounced',
        'complained',
        'suppressed',
        'failed'
      )
    ),
  resend_email_id text unique
    check (
      resend_email_id is null or
      char_length(resend_email_id) between 1 and 200
    ),
  sanitized_error text
    check (
      sanitized_error is null or (
        char_length(sanitized_error) between 1 and 300 and
        sanitized_error !~ '[[:cntrl:]]'
      )
    ),
  attempt_count integer not null default 1
    check (attempt_count between 1 and 100),
  sent_at timestamptz,
  delivered_at timestamptz,
  bounced_at timestamptz,
  complained_at timestamptz,
  suppressed_at timestamptz,
  failed_at timestamptz,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.quotation_email_deliveries is
  'Server-only audit metadata for quotation email delivery; never stores recipient addresses or attachment contents.';

create index quotation_email_deliveries_quotation_created_idx
  on public.quotation_email_deliveries (quotation_number, created_at desc);
create index quotation_email_deliveries_status_event_idx
  on public.quotation_email_deliveries (status, last_event_at desc);
create index quotation_email_deliveries_recipient_created_idx
  on public.quotation_email_deliveries (recipient_fingerprint, created_at desc);

drop trigger if exists quotation_email_deliveries_set_updated_at
  on public.quotation_email_deliveries;
create trigger quotation_email_deliveries_set_updated_at
before update on public.quotation_email_deliveries
for each row execute function public.set_updated_at();

alter table public.quotation_email_deliveries enable row level security;

revoke all on table public.quotation_email_deliveries
  from public, anon, authenticated, service_role;

grant select, insert, update, delete on table public.quotation_email_deliveries
  to service_role;
