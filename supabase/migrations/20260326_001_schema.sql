-- ============================================================
-- ConsulentaVirtuale — Schema Completo v1.0
-- ============================================================

-- Estensioni
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- per ricerca full-text

-- ============================================================
-- FUNZIONE UPDATED_AT automatico
-- ============================================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. PROFILES (estende auth.users)
-- ============================================================
create table if not exists profiles (
  id            uuid references auth.users on delete cascade primary key,
  role          text not null default 'client' check (role in ('client', 'studio', 'admin')),
  full_name     text,
  email         text unique,
  phone         text,
  avatar_url    text,
  studio_name   text,
  fiscal_code   text,
  vat_number    text,
  address       text,
  city          text,
  province      text,
  zip_code      text,
  pec           text,
  sdi_code      text,
  iban          text,
  onboarded     boolean default false,
  plan          text default 'free' check (plan in ('free', 'starter', 'pro', 'enterprise')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger profiles_updated_at before update on profiles
  for each row execute procedure handle_updated_at();

alter table profiles enable row level security;

create policy "Utenti vedono solo il proprio profilo"
  on profiles for select using (auth.uid() = id);

create policy "Utenti aggiornano solo il proprio profilo"
  on profiles for update using (auth.uid() = id);

-- ============================================================
-- 2. CLIENTS
-- ============================================================
create table if not exists clients (
  id                  uuid default uuid_generate_v4() primary key,
  studio_id           uuid references profiles(id) on delete set null,
  name                text not null,
  fiscal_code         text,
  vat_number          text,
  ateco               text,
  ateco_description   text,
  regime              text check (regime in ('forfettario', 'ordinario', 'semplificato')),
  package_type        text check (package_type in ('forfettario', 'ditta_individuale', 'societa_persone', 'societa_capitali', 'enti_non_commerciali')),
  email               text,
  phone               text,
  address             text,
  city                text,
  province            text,
  zip_code            text,
  pec                 text,
  sdi_code            text,
  iban                text,
  start_date          date,
  status              text default 'attivo' check (status in ('attivo', 'sospeso', 'cessato')),
  annual_revenue      numeric(12,2),
  monthly_fee         numeric(8,2),
  notes               text,
  tags                text[],
  risk_score          integer default 0 check (risk_score between 0 and 100),
  last_contact        date,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index clients_studio_id_idx on clients(studio_id);
create index clients_status_idx on clients(status);
create index clients_fiscal_code_idx on clients(fiscal_code);
create index clients_name_trgm_idx on clients using gin(name gin_trgm_ops);

create trigger clients_updated_at before update on clients
  for each row execute procedure handle_updated_at();

alter table clients enable row level security;

create policy "Studio vede i propri clienti"
  on clients for select using (studio_id = auth.uid());
create policy "Studio gestisce i propri clienti"
  on clients for all using (studio_id = auth.uid());

-- ============================================================
-- 3. INVOICES
-- ============================================================
create table if not exists invoices (
  id                uuid default uuid_generate_v4() primary key,
  client_id         uuid references clients(id) on delete set null,
  studio_id         uuid references profiles(id) on delete set null,
  number            text not null,
  date              date not null,
  client_name       text,
  recipient_name    text,
  recipient_vat     text,
  recipient_fc      text,
  amount            numeric(12,2) not null default 0,
  vat_rate          numeric(5,2) default 22,
  vat_amount        numeric(12,2) default 0,
  total             numeric(12,2) not null default 0,
  status            text default 'bozza' check (status in ('bozza', 'inviata', 'consegnata', 'accettata', 'rifiutata', 'scartata')),
  type              text not null check (type in ('emessa', 'ricevuta')),
  xml_content       text,
  sdi_id            text,
  sdi_status        text,
  payment_date      date,
  payment_method    text check (payment_method in ('bonifico', 'contanti', 'assegno', 'rid', 'altro')),
  due_date          date,
  paid              boolean default false,
  paid_at           timestamptz,
  notes             text,
  line_items        jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index invoices_studio_id_idx on invoices(studio_id);
create index invoices_client_id_idx on invoices(client_id);
create index invoices_status_idx on invoices(status);
create index invoices_date_idx on invoices(date);

create trigger invoices_updated_at before update on invoices
  for each row execute procedure handle_updated_at();

alter table invoices enable row level security;

create policy "Studio gestisce le proprie fatture"
  on invoices for all using (studio_id = auth.uid());

-- ============================================================
-- 4. DEADLINES
-- ============================================================
create table if not exists deadlines (
  id              uuid default uuid_generate_v4() primary key,
  studio_id       uuid references profiles(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  client_name     text,
  title           text not null,
  description     text,
  due_date        date not null,
  type            text not null check (type in ('inps', 'inail', 'ade', 'altro')),
  urgency         text default 'normale' check (urgency in ('normale', 'imminente', 'scaduta')),
  completed       boolean default false,
  completed_at    timestamptz,
  amount          numeric(12,2),
  payment_code    text,
  recurrence      text check (recurrence in ('mensile', 'trimestrale', 'semestrale', 'annuale')),
  alert_days      integer default 7,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index deadlines_studio_id_idx on deadlines(studio_id);
create index deadlines_due_date_idx on deadlines(due_date);
create index deadlines_completed_idx on deadlines(completed);

create trigger deadlines_updated_at before update on deadlines
  for each row execute procedure handle_updated_at();

alter table deadlines enable row level security;

create policy "Studio gestisce le proprie scadenze"
  on deadlines for all using (studio_id = auth.uid());

-- ============================================================
-- 5. TICKETS
-- ============================================================
create table if not exists tickets (
  id              uuid default uuid_generate_v4() primary key,
  studio_id       uuid references profiles(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  client_name     text,
  subject         text not null,
  category        text not null check (category in ('fiscale', 'contributivo', 'lavoro', 'societario', 'altro')),
  status          text default 'aperto' check (status in ('aperto', 'in_lavorazione', 'chiuso')),
  priority        text default 'media' check (priority in ('bassa', 'media', 'alta', 'urgente')),
  last_message    text,
  assigned_to     uuid references profiles(id),
  resolved_at     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index tickets_studio_id_idx on tickets(studio_id);
create index tickets_status_idx on tickets(status);
create index tickets_priority_idx on tickets(priority);

create trigger tickets_updated_at before update on tickets
  for each row execute procedure handle_updated_at();

alter table tickets enable row level security;

create policy "Studio gestisce i propri ticket"
  on tickets for all using (studio_id = auth.uid());

-- ============================================================
-- 6. TICKET MESSAGES
-- ============================================================
create table if not exists ticket_messages (
  id            uuid default uuid_generate_v4() primary key,
  ticket_id     uuid references tickets(id) on delete cascade not null,
  sender_id     uuid references profiles(id),
  sender_role   text check (sender_role in ('client', 'studio', 'ai')),
  sender_name   text,
  content       text not null,
  attachments   text[],
  created_at    timestamptz default now()
);

create index ticket_messages_ticket_id_idx on ticket_messages(ticket_id);

alter table ticket_messages enable row level security;

create policy "Accesso messaggi ticket via ticket"
  on ticket_messages for all using (
    exists (
      select 1 from tickets where tickets.id = ticket_id and tickets.studio_id = auth.uid()
    )
  );

-- ============================================================
-- 7. DOCUMENTS
-- ============================================================
create table if not exists documents (
  id              uuid default uuid_generate_v4() primary key,
  studio_id       uuid references profiles(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  name            text not null,
  type            text check (type in ('fattura', 'delega', 'contratto', 'cu', 'busta_paga', 'accertamento', 'dvr', 'altro')),
  mime_type       text,
  size_kb         integer,
  storage_path    text,
  public_url      text,
  signed          boolean default false,
  signed_at       timestamptz,
  signature_id    text,
  category        text,
  tags            text[],
  year            integer,
  description     text,
  uploaded_at     timestamptz default now(),
  created_at      timestamptz default now()
);

create index documents_studio_id_idx on documents(studio_id);
create index documents_client_id_idx on documents(client_id);
create index documents_type_idx on documents(type);
create index documents_name_trgm_idx on documents using gin(name gin_trgm_ops);

alter table documents enable row level security;

create policy "Studio gestisce i propri documenti"
  on documents for all using (studio_id = auth.uid());

-- ============================================================
-- 8. TODO ITEMS
-- ============================================================
create table if not exists todo_items (
  id            uuid default uuid_generate_v4() primary key,
  studio_id     uuid references profiles(id) on delete set null,
  client_id     uuid references clients(id) on delete set null,
  client_name   text,
  title         text not null,
  description   text,
  completed     boolean default false,
  completed_at  timestamptz,
  due_date      date,
  priority      text default 'media' check (priority in ('bassa', 'media', 'alta')),
  category      text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index todo_items_studio_id_idx on todo_items(studio_id);
create index todo_items_completed_idx on todo_items(completed);

create trigger todo_items_updated_at before update on todo_items
  for each row execute procedure handle_updated_at();

alter table todo_items enable row level security;

create policy "Studio gestisce i propri todo"
  on todo_items for all using (studio_id = auth.uid());

-- ============================================================
-- 9. TAX ASSESSMENTS (ACCERTAMENTI)
-- ============================================================
create table if not exists tax_assessments (
  id                      uuid default uuid_generate_v4() primary key,
  studio_id               uuid references profiles(id) on delete set null,
  client_id               uuid references clients(id) on delete set null,
  client_name             text,
  category                text not null check (category in ('imposte_dirette', 'iva', 'registro', 'locale', 'contributivo')),
  status                  text default 'caricato' check (status in ('caricato', 'in_valutazione', 'documenti_richiesti', 'in_lavorazione', 'concluso')),
  notification_date       date,
  upload_date             date,
  amount                  numeric(14,2),
  penalties               numeric(14,2),
  interest                numeric(14,2),
  total_claimed           numeric(14,2),
  description             text,
  document_path           text,
  response_deadline       date,
  impugnation_deadline    date,
  tax_year                integer,
  authority               text,
  protocol_number         text,
  defense_strategy        text,
  outcome                 text,
  settlement_amount       numeric(14,2),
  success_fee_pct         numeric(5,2),
  notes                   text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create index tax_assessments_studio_id_idx on tax_assessments(studio_id);
create index tax_assessments_status_idx on tax_assessments(status);
create index tax_assessments_category_idx on tax_assessments(category);

create trigger tax_assessments_updated_at before update on tax_assessments
  for each row execute procedure handle_updated_at();

alter table tax_assessments enable row level security;

create policy "Studio gestisce i propri accertamenti"
  on tax_assessments for all using (studio_id = auth.uid());

-- ============================================================
-- 10. CHAT MESSAGES
-- ============================================================
create table if not exists chat_messages (
  id            uuid default uuid_generate_v4() primary key,
  studio_id     uuid references profiles(id) on delete set null,
  client_id     uuid references clients(id) on delete set null,
  sender_id     uuid references profiles(id),
  sender_role   text not null check (sender_role in ('client', 'studio', 'ai')),
  sender_name   text,
  text          text not null,
  is_ai         boolean default false,
  read_at       timestamptz,
  attachment_url  text,
  attachment_name text,
  created_at    timestamptz default now()
);

create index chat_messages_studio_id_idx on chat_messages(studio_id);
create index chat_messages_client_id_idx on chat_messages(client_id);
create index chat_messages_created_at_idx on chat_messages(created_at);

alter table chat_messages enable row level security;

create policy "Studio legge i propri messaggi"
  on chat_messages for select using (studio_id = auth.uid());
create policy "Studio invia messaggi"
  on chat_messages for insert with check (studio_id = auth.uid() or sender_id = auth.uid());

-- ============================================================
-- 11. AI NOTIFICATIONS
-- ============================================================
create table if not exists ai_notifications (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references profiles(id) on delete cascade,
  type          text not null check (type in ('bando', 'legge', 'rottamazione', 'scadenza', 'anomalia')),
  title         text not null,
  summary       text,
  action_label  text,
  action_url    text,
  read          boolean default false,
  read_at       timestamptz,
  priority      text default 'normale' check (priority in ('bassa', 'normale', 'alta', 'urgente')),
  date          text not null,
  expires_at    timestamptz,
  created_at    timestamptz default now()
);

create index ai_notifications_user_id_idx on ai_notifications(user_id);
create index ai_notifications_read_idx on ai_notifications(read);
create index ai_notifications_type_idx on ai_notifications(type);

alter table ai_notifications enable row level security;

create policy "Utenti vedono solo le proprie notifiche"
  on ai_notifications for all using (user_id = auth.uid());

-- ============================================================
-- 12. DVR DOCUMENTS
-- ============================================================
create table if not exists dvr_documents (
  id                uuid default uuid_generate_v4() primary key,
  studio_id         uuid references profiles(id) on delete set null,
  client_id         uuid references clients(id) on delete set null,
  client_name       text,
  title             text not null,
  risk_level        text default 'medio' check (risk_level in ('basso', 'medio', 'alto')),
  status            text default 'bozza' check (status in ('bozza', 'completato', 'firmato', 'scaduto')),
  version           text default '1.0',
  created_date      date,
  review_date       date,
  next_review_date  date,
  signed_date       date,
  document_path     text,
  workers_count     integer,
  activity_type     text,
  ateco_code        text,
  rspp_name         text,
  rls_name          text,
  medico_competente text,
  risk_areas        jsonb,
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index dvr_documents_studio_id_idx on dvr_documents(studio_id);
create index dvr_documents_status_idx on dvr_documents(status);

create trigger dvr_documents_updated_at before update on dvr_documents
  for each row execute procedure handle_updated_at();

alter table dvr_documents enable row level security;

create policy "Studio gestisce i propri DVR"
  on dvr_documents for all using (studio_id = auth.uid());

-- ============================================================
-- 13. COLF WORKERS
-- ============================================================
create table if not exists colf_workers (
  id                  uuid default uuid_generate_v4() primary key,
  studio_id           uuid references profiles(id) on delete set null,
  client_id           uuid references clients(id) on delete set null,
  full_name           text not null,
  fiscal_code         text,
  birth_date          date,
  birth_place         text,
  nationality         text default 'Italiana',
  document_type       text,
  document_number     text,
  document_expiry     date,
  permit_to_stay      text,
  permit_expiry       date,
  address             text,
  phone               text,
  email               text,
  iban                text,
  contract_type       text check (contract_type in ('convivente', 'non_convivente', 'badante', 'baby_sitter')),
  hours_per_week      numeric(5,2),
  days_per_week       integer,
  level               text check (level in ('A', 'AS', 'B', 'BS', 'C', 'CS', 'D', 'DS')),
  gross_salary        numeric(8,2),
  net_salary          numeric(8,2),
  start_date          date,
  end_date            date,
  status              text default 'attivo' check (status in ('attivo', 'sospeso', 'cessato')),
  cessation_reason    text,
  inps_matricola      text,
  inps_position       text,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index colf_workers_studio_id_idx on colf_workers(studio_id);
create index colf_workers_client_id_idx on colf_workers(client_id);
create index colf_workers_status_idx on colf_workers(status);

create trigger colf_workers_updated_at before update on colf_workers
  for each row execute procedure handle_updated_at();

alter table colf_workers enable row level security;

create policy "Studio gestisce i propri lavoratori domestici"
  on colf_workers for all using (studio_id = auth.uid());

-- ============================================================
-- 14. COLF PAYSLIPS
-- ============================================================
create table if not exists colf_payslips (
  id                    uuid default uuid_generate_v4() primary key,
  worker_id             uuid references colf_workers(id) on delete cascade not null,
  studio_id             uuid references profiles(id) on delete set null,
  month                 text not null,
  year                  integer not null,
  working_days          integer,
  regular_hours         numeric(6,2),
  extra_hours           numeric(6,2),
  holiday_hours         numeric(6,2),
  gross_amount          numeric(10,2),
  net_amount            numeric(10,2),
  inps_contribution     numeric(8,2),
  inps_worker_share     numeric(8,2),
  inps_employer_share   numeric(8,2),
  irpef                 numeric(8,2),
  trf_quota             numeric(8,2),
  extra_hours_amount    numeric(8,2),
  holiday_pay           numeric(8,2),
  tredicesima           numeric(8,2),
  quattordicesima       numeric(8,2),
  deductions            numeric(8,2),
  document_path         text,
  sent_at               timestamptz,
  generated_at          timestamptz default now()
);

create index colf_payslips_worker_id_idx on colf_payslips(worker_id);
create index colf_payslips_year_month_idx on colf_payslips(year, month);

alter table colf_payslips enable row level security;

create policy "Studio gestisce le proprie buste paga"
  on colf_payslips for all using (studio_id = auth.uid());

-- ============================================================
-- FUNZIONE: gestione nuovo utente (trigger su auth.users)
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
