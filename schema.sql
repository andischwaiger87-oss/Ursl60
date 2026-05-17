-- Erstelle die Tabelle für die Erinnerungen
create table public.memories (
  id uuid default gen_random_uuid() primary key,
  image_id text not null,
  author_name text not null,
  memory_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) aktivieren
alter table public.memories enable row level security;

-- Policy: Jeder darf lesen (wir brauchen keinen Login für die Gäste)
create policy "Jeder darf Erinnerungen lesen"
  on public.memories for select
  to public
  using (true);

-- Policy: Jeder darf neue Erinnerungen einfügen
create policy "Jeder darf Erinnerungen hinzufügen"
  on public.memories for insert
  to public
  with check (true);
