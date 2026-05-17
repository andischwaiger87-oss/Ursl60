-- 1. Tabelle für Bilder erstellen
create table public.images (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  year_text text not null,
  title_text text not null,
  sort_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS aktivieren und offene Policies setzen (Sicherheit läuft über Frontend-Passwort)
alter table public.images enable row level security;

create policy "Jeder darf Bilder lesen" on public.images for select to public using (true);
create policy "Jeder darf Bilder hinzufügen" on public.images for insert to public with check (true);
create policy "Jeder darf Bilder bearbeiten" on public.images for update to public using (true);
create policy "Jeder darf Bilder löschen" on public.images for delete to public using (true);

-- 2. Bestehende Memories-Tabelle für Update/Delete öffnen
create policy "Jeder darf Erinnerungen bearbeiten" on public.memories for update to public using (true);
create policy "Jeder darf Erinnerungen löschen" on public.memories for delete to public using (true);

-- 3. Initiale Bilder migrieren
INSERT INTO public.images (filename, year_text, title_text, sort_order) VALUES
('01.jpg', 'Erinnerung', 'Bild 1', 1),
('02.jpg', 'Erinnerung', 'Bild 2', 2),
('03.jpg', 'Erinnerung', 'Bild 3', 3),
('04.jpg', 'Erinnerung', 'Bild 4', 4),
('05.jpg', 'Erinnerung', 'Bild 5', 5),
('06.jpg', 'Erinnerung', 'Bild 6', 6),
('07.jpg', 'Erinnerung', 'Bild 7', 7),
('08.jpg', 'Erinnerung', 'Bild 8', 8),
('09.jpg', 'Erinnerung', 'Bild 9', 9),
('10.jpg', 'Erinnerung', 'Bild 10', 10),
('11.jpg', 'Erinnerung', 'Bild 11', 11),
('12.jpg', 'Erinnerung', 'Bild 12', 12),
('13.jpg', 'Erinnerung', 'Bild 13', 13),
('14.jpg', 'Erinnerung', 'Bild 14', 14),
('15.jpg', 'Erinnerung', 'Bild 15', 15),
('16.jpg', 'Erinnerung', 'Bild 16', 16),
('17.jpg', 'Erinnerung', 'Bild 17', 17),
('18.jpg', 'Erinnerung', 'Bild 18', 18),
('19.jpg', 'Erinnerung', 'Bild 19', 19),
('20.jpg', 'Erinnerung', 'Bild 20', 20),
('21.jpg', 'Erinnerung', 'Bild 21', 21),
('22.jpg', 'Erinnerung', 'Bild 22', 22),
('23.jpg', 'Erinnerung', 'Bild 23', 23),
('24.jpg', 'Erinnerung', 'Bild 24', 24),
('25.jpg', 'Erinnerung', 'Bild 25', 25),
('26.jpg', 'Erinnerung', 'Bild 26', 26),
('27.jpg', 'Erinnerung', 'Bild 27', 27),
('28.jpg', 'Erinnerung', 'Bild 28', 28),
('29.jpg', 'Erinnerung', 'Bild 29', 29),
('ursula.jpg', 'Erinnerung', 'Ursula', 30);
