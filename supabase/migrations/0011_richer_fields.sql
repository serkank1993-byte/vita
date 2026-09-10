-- Her modüle daha fazla ve anlamlı veri girişi için ek alanlar.

alter table public.todos
  add column if not exists priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high'));

alter table public.shopping_items
  add column if not exists store text;

alter table public.pets
  add column if not exists weight_kg numeric(6, 2),
  add column if not exists microchip_number text;

alter table public.events
  add column if not exists location text,
  add column if not exists category text not null default 'general'
    check (category in ('general', 'birthday', 'appointment', 'holiday', 'reminder'));

alter table public.transactions
  add column if not exists payment_method text,
  add column if not exists is_recurring boolean not null default false;

alter table public.health_records
  add column if not exists record_type text not null default 'checkup'
    check (record_type in ('checkup', 'vaccination', 'medication', 'allergy', 'other')),
  add column if not exists doctor_or_clinic text;

alter table public.inventory_items
  add column if not exists serial_number text,
  add column if not exists condition text
    check (condition in ('new', 'good', 'fair', 'poor'));

alter table public.archive_files
  add column if not exists category text;
