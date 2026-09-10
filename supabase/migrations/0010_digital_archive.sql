-- Aile başına izole, özel (private) bir storage bucket. Dosya yolu
-- kuralı: "{family_id}/{dosya}" — storage RLS politikaları bu ilk
-- klasör segmentini family_id olarak kullanıp is_family_member() ile
-- kontrol ediyor.
insert into storage.buckets (id, name, public)
values ('archive', 'archive', false)
on conflict (id) do nothing;

create table if not exists public.archive_files (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  content_type text,
  size_bytes bigint,
  description text,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists archive_files_family_id_idx on public.archive_files (family_id);

alter table public.archive_files enable row level security;

drop policy if exists archive_files_select on public.archive_files;
create policy archive_files_select on public.archive_files
  for select using (public.is_family_member(family_id));

drop policy if exists archive_files_insert on public.archive_files;
create policy archive_files_insert on public.archive_files
  for insert with check (public.is_family_member(family_id));

drop policy if exists archive_files_delete on public.archive_files;
create policy archive_files_delete on public.archive_files
  for delete using (public.is_family_member(family_id));

drop policy if exists archive_storage_select on storage.objects;
create policy archive_storage_select on storage.objects
  for select using (
    bucket_id = 'archive'
    and public.is_family_member(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists archive_storage_insert on storage.objects;
create policy archive_storage_insert on storage.objects
  for insert with check (
    bucket_id = 'archive'
    and public.is_family_member(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists archive_storage_delete on storage.objects;
create policy archive_storage_delete on storage.objects
  for delete using (
    bucket_id = 'archive'
    and public.is_family_member(((storage.foldername(name))[1])::uuid)
  );
