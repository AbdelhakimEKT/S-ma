-- ============================================================
-- Söma — Schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Table principale des réservations
create table if not exists public.reservations (
  id                   uuid default gen_random_uuid() primary key,
  ritual_slug          text not null,
  ritual_name          text not null,
  date                 date not null,
  start_time           time not null,       -- "HH:MM:SS"
  end_time             time not null,       -- "HH:MM:SS"  (start + duration)
  duration_minutes     integer not null,
  guests               integer not null default 1,
  total_eur            numeric(8,2) not null,   -- en euros
  deposit_eur          numeric(8,2) not null,   -- en euros (30 %)
  status               text not null default 'pending_payment',
  -- 'pending_payment' | 'confirmed' | 'cancelled' | 'failed'
  stripe_session_id    text unique,
  stripe_payment_status text,
  guest_first_name     text not null,
  guest_last_name      text not null,
  guest_email          text not null,
  guest_phone          text not null,
  guest_notes          text,
  guest_newsletter     boolean not null default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- Mise à jour automatique du champ updated_at
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_updated_at on public.reservations;
create trigger reservations_updated_at
  before update on public.reservations
  for each row execute function handle_updated_at();

-- Index pour les requêtes de disponibilité (fréquentes)
create index if not exists reservations_date_idx    on public.reservations(date);
create index if not exists reservations_status_idx  on public.reservations(status);
create index if not exists reservations_session_idx on public.reservations(stripe_session_id);

-- Row Level Security
alter table public.reservations enable row level security;

-- Politique : seul le service role (API serveur) peut tout faire.
-- Le client navigateur n'a pas accès direct à cette table.
-- (Les clés anon n'ont aucune politique → accès refusé par défaut.)

-- Si vous souhaitez permettre la lecture d'une réservation par email :
-- create policy "Read own reservation"
--   on public.reservations for select
--   using (guest_email = current_setting('request.jwt.claims')::json->>'email');
-- (nécessite Supabase Auth — non utilisé ici)
