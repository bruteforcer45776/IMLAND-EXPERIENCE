create table if not exists public.ab_test_daily_metrics (
  metric_date date not null default current_date,
  experiment text not null,
  variant text not null check (variant in ('A','B')),
  event text not null check (event in ('impression','conversion')),
  page text not null,
  total bigint not null default 0 check (total >= 0),
  primary key (metric_date, experiment, variant, event, page)
);

alter table public.ab_test_daily_metrics enable row level security;
revoke all on table public.ab_test_daily_metrics from anon, authenticated;

create or replace function public.record_ab_event(p_experiment text, p_variant text, p_event text, p_page text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_experiment <> 'header_app_cta_v1'
     or p_variant not in ('A','B')
     or p_event not in ('impression','conversion')
     or p_page !~ '^/[A-Za-z0-9_./-]{0,119}$' then
    raise exception 'invalid experiment event';
  end if;
  insert into public.ab_test_daily_metrics(metric_date, experiment, variant, event, page, total)
  values (current_date, p_experiment, p_variant, p_event, p_page, 1)
  on conflict (metric_date, experiment, variant, event, page)
  do update set total = public.ab_test_daily_metrics.total + 1;
end;
$$;

revoke all on function public.record_ab_event(text,text,text,text) from public, anon, authenticated;
grant execute on function public.record_ab_event(text,text,text,text) to service_role;
