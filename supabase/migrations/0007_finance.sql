create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text,
  note text,
  occurred_on date not null default current_date,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists transactions_family_id_idx on public.transactions (family_id);
create index if not exists transactions_occurred_on_idx on public.transactions (occurred_on);

alter table public.transactions enable row level security;

drop policy if exists transactions_select on public.transactions;
create policy transactions_select on public.transactions
  for select using (public.is_family_member(family_id));

drop policy if exists transactions_insert on public.transactions;
create policy transactions_insert on public.transactions
  for insert with check (public.is_family_member(family_id));

drop policy if exists transactions_update on public.transactions;
create policy transactions_update on public.transactions
  for update using (public.is_family_member(family_id));

drop policy if exists transactions_delete on public.transactions;
create policy transactions_delete on public.transactions
  for delete using (public.is_family_member(family_id));
