create table if not exists public.chatbot_daily_usage (
  ip_hash text not null,
  usage_date date not null default current_date,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (ip_hash, usage_date)
);

alter table public.chatbot_daily_usage enable row level security;
revoke all on table public.chatbot_daily_usage from public, anon, authenticated;

create or replace function public.consume_chatbot_quota(
  requested_ip_hash text,
  requested_limit integer default 20
)
returns table (allowed boolean, remaining integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_count integer;
begin
  if requested_ip_hash is null or length(requested_ip_hash) <> 64 then
    raise exception 'invalid ip hash';
  end if;

  if requested_limit < 1 or requested_limit > 100 then
    raise exception 'invalid limit';
  end if;

  insert into public.chatbot_daily_usage (ip_hash, usage_date, request_count, updated_at)
  values (requested_ip_hash, current_date, 1, now())
  on conflict (ip_hash, usage_date) do update
    set request_count = public.chatbot_daily_usage.request_count + 1,
        updated_at = now()
    where public.chatbot_daily_usage.request_count < requested_limit
  returning request_count into next_count;

  if next_count is null then
    select request_count into next_count
    from public.chatbot_daily_usage
    where ip_hash = requested_ip_hash and usage_date = current_date;
    return query select false, greatest(requested_limit - next_count, 0);
  end if;

  return query select true, greatest(requested_limit - next_count, 0);
end;
$$;

revoke all on function public.consume_chatbot_quota(text, integer) from public, anon, authenticated;
grant execute on function public.consume_chatbot_quota(text, integer) to service_role;
