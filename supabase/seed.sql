-- ============================================================
-- ConsulentaVirtuale — Seed Data Demo
-- Inserisce dati di esempio per testing e demo
-- ============================================================

-- NOTA: Prima di eseguire questo seed, crea un utente studio demo
-- tramite Supabase Auth e inserisci il suo UUID come STUDIO_ID

-- Utente studio demo (inserire dopo la creazione via auth)
-- UPDATE profiles SET studio_name = 'Studio Conti & Associati', full_name = 'Dott. Mario Conti' WHERE id = 'IL_TUO_STUDIO_UUID';

-- ============================================================
-- CLIENTI DEMO
-- ============================================================
do $$
declare
  studio_uuid uuid;
  client1_id uuid := uuid_generate_v4();
  client2_id uuid := uuid_generate_v4();
  client3_id uuid := uuid_generate_v4();
  client4_id uuid := uuid_generate_v4();
  client5_id uuid := uuid_generate_v4();
begin
  -- Prendi il primo studio disponibile
  select id into studio_uuid from profiles where role = 'studio' limit 1;
  if studio_uuid is null then return; end if;

  insert into clients (id, studio_id, name, fiscal_code, vat_number, ateco, ateco_description, regime, package_type, email, phone, address, city, province, start_date, status, annual_revenue, risk_score) values
    (client1_id, studio_uuid, 'Marco Rossi', 'RSSMRC85M01H501Z', null, '74.90.9', 'Altre attività professionali', 'forfettario', 'forfettario', 'marco.rossi@email.it', '333-1234567', 'Via Roma 12', 'Milano', 'MI', '2020-01-01', 'attivo', 48600, 15),
    (client2_id, studio_uuid, 'Giulia Ferri S.r.l.', 'FRRGLL92A41F205X', '02345678901', '62.01.0', 'Produzione di software', 'ordinario', 'societa_capitali', 'admin@giuliaferri.it', '02-9876543', 'Via Garibaldi 45', 'Roma', 'RM', '2019-03-15', 'attivo', 285000, 25),
    (client3_id, studio_uuid, 'Pasticceria Bianchi', 'BNCPQL78C12G273K', '03456789012', '10.71.2', 'Produzione di pasticceria', 'ordinario', 'ditta_individuale', 'info@pasticceriabianchi.it', '045-123456', 'Corso Italia 8', 'Verona', 'VR', '2018-06-01', 'attivo', 195000, 35),
    (client4_id, studio_uuid, 'Studio Legale Verdi', 'VRDLGU65R04L219O', null, '69.10.1', 'Attività degli studi legali', 'forfettario', 'forfettario', 'verdi@studioverdi.it', '06-55432100', 'Via Nazionale 67', 'Roma', 'RM', '2021-01-01', 'attivo', 67000, 10),
    (client5_id, studio_uuid, 'TechStart Innovations', 'MRNLSS91H20F205R', '04567890123', '72.19.0', 'Ricerca e sviluppo', 'ordinario', 'societa_capitali', 'ceo@techstart.io', '02-11223344', 'Via dell''Innovazione 1', 'Milano', 'MI', '2022-09-01', 'attivo', 520000, 20);

  -- FATTURE
  insert into invoices (client_id, studio_id, number, date, client_name, recipient_name, recipient_vat, amount, vat_rate, vat_amount, total, status, type, payment_method, paid) values
    (client1_id, studio_uuid, 'FT-2026-001', '2026-01-15', 'Marco Rossi', 'Condominio Villa Azzurra', 'CDMVLL00A00H501Z', 1200.00, 0, 0, 1200.00, 'accettata', 'emessa', 'bonifico', true),
    (client1_id, studio_uuid, 'FT-2026-002', '2026-02-01', 'Marco Rossi', 'Studio Architect Milano', '01234567890', 2500.00, 0, 0, 2500.00, 'accettata', 'emessa', 'bonifico', true),
    (client2_id, studio_uuid, 'FT-2026-003', '2026-01-20', 'Giulia Ferri S.r.l.', 'Banca Intesa Sanpaolo', '01234567891', 15000.00, 22, 3300.00, 18300.00, 'consegnata', 'emessa', 'bonifico', false),
    (client2_id, studio_uuid, 'FT-2026-004', '2026-02-15', 'Giulia Ferri S.r.l.', 'Comune di Roma', '01234567892', 8500.00, 22, 1870.00, 10370.00, 'accettata', 'emessa', 'bonifico', true),
    (client3_id, studio_uuid, 'FT-2026-005', '2026-03-01', 'Pasticceria Bianchi', 'Fornitura Dolciumi SpA', '01234567893', 4200.00, 10, 420.00, 4620.00, 'inviata', 'emessa', 'bonifico', false),
    (client1_id, studio_uuid, 'FT-2026-006', '2026-03-10', 'Marco Rossi', 'Agenzie Immobiliari Univ.', '01234567894', 3600.00, 0, 0, 3600.00, 'bozza', 'emessa', null, false);

  -- SCADENZE
  insert into deadlines (studio_id, client_id, client_name, title, description, due_date, type, urgency, completed, amount, payment_code) values
    (studio_uuid, client1_id, 'Marco Rossi', 'Versamento IVA Trimestrale Q1', 'Liquidazione e versamento IVA 1° trimestre 2026', '2026-05-16', 'ade', 'imminente', false, 1840.00, 'F24'),
    (studio_uuid, client1_id, 'Marco Rossi', 'Acconto IRPEF II Rata', 'Secondo acconto IRPEF anno 2026', '2026-11-30', 'ade', 'normale', false, 3200.00, 'F24'),
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'INPS Artigiani Q1', 'Contributi INPS artigiani e commercianti', '2026-05-16', 'inps', 'imminente', false, 2890.00, 'F24'),
    (studio_uuid, client3_id, 'Pasticceria Bianchi', 'Modello 730 Dipendenti', 'Presentazione 730 per 3 dipendenti', '2026-09-30', 'ade', 'normale', false, null, null),
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'Dichiarazione IVA Annuale', 'Presentazione dichiarazione IVA 2025', '2026-04-30', 'ade', 'scaduta', false, 0, null),
    (studio_uuid, client4_id, 'Studio Legale Verdi', 'Fatturazione Elettronica Verifica', 'Verifica invii SDI pendenti', '2026-04-15', 'ade', 'imminente', false, null, null),
    (studio_uuid, null, null, 'INAIL Premio Annuale', 'Pagamento premio INAIL tutti i clienti', '2026-02-16', 'inail', 'normale', true, null, null);

  -- TICKETS
  insert into tickets (studio_id, client_id, client_name, subject, category, status, priority, last_message) values
    (studio_uuid, client1_id, 'Marco Rossi', 'Richiesta chiarimento forfettario 2026', 'fiscale', 'aperto', 'alta', 'Buongiorno, ho una domanda sul limite di ricavi...'),
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'Accertamento IVA 2022 — risposta urgente', 'fiscale', 'in_lavorazione', 'urgente', 'Ho ricevuto la notifica dall''Agenzia delle Entrate...'),
    (studio_uuid, client3_id, 'Pasticceria Bianchi', 'Assunzione nuovo dipendente', 'lavoro', 'aperto', 'media', 'Devo assumere un pasticcere, quali documenti servono?'),
    (studio_uuid, client4_id, 'Studio Legale Verdi', 'Cambio regime fiscale 2027', 'fiscale', 'aperto', 'bassa', 'Valutazione convenienza cambio regime per 2027...');

  -- TODO ITEMS
  insert into todo_items (studio_id, client_id, client_name, title, description, completed, due_date, priority) values
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'Predisporre risposta accertamento IVA', 'Raccogliere documentazione e preparare memoria difensiva', false, '2026-04-10', 'alta'),
    (studio_uuid, client1_id, 'Marco Rossi', 'Aggiornare dati fiscali 2025', 'Verificare CU e inserire dati nel gestionale', false, '2026-04-15', 'media'),
    (studio_uuid, client3_id, 'Pasticceria Bianchi', 'Preparare busta paga marzo', 'Calcolare e inviare busta paga dipendenti', false, '2026-04-05', 'alta'),
    (studio_uuid, null, null, 'Rinnovare contratto software', 'Contattare fornitore per rinnovo annuale', false, '2026-05-01', 'bassa'),
    (studio_uuid, client5_id, 'TechStart Innovations', 'Analisi rottamazione quinquies', 'Verificare carichi pendenti per rottamazione', true, '2026-03-31', 'alta');

  -- ACCERTAMENTI
  insert into tax_assessments (studio_id, client_id, client_name, category, status, notification_date, upload_date, amount, penalties, interest, description, response_deadline, tax_year, authority, protocol_number) values
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'iva', 'in_lavorazione', '2026-02-14', '2026-02-20', 45000.00, 11250.00, 3800.00, 'Rettifica IVA detratta su operazioni inesistenti 2022', '2026-05-14', 2022, 'Agenzia delle Entrate — Ufficio di Roma', 'TF/2026/0012345'),
    (studio_uuid, client3_id, 'Pasticceria Bianchi', 'imposte_dirette', 'documenti_richiesti', '2026-01-10', '2026-01-18', 12800.00, 3200.00, 780.00, 'Accertamento reddito d''impresa 2021 — ricavi non contabilizzati', '2026-04-10', 2021, 'Guardia di Finanza — Verona', 'GdF/2026/VR/00890'),
    (studio_uuid, client1_id, 'Marco Rossi', 'contributivo', 'caricato', '2026-03-01', '2026-03-05', 3500.00, 0, 420.00, 'Contributi INPS non versati 2023 — regime forfettario', '2026-06-01', 2023, 'INPS — Sede di Milano', 'INPS/2026/MI/45678');

  -- DVR
  insert into dvr_documents (studio_id, client_id, client_name, title, risk_level, status, version, created_date, review_date, workers_count, activity_type, ateco_code) values
    (studio_uuid, client3_id, 'Pasticceria Bianchi', 'DVR Pasticceria — Laboratorio Produzione', 'medio', 'firmato', '2.1', '2024-01-15', '2026-01-15', 8, 'Produzione artigianale alimentare', '10.71.2'),
    (studio_uuid, client2_id, 'Giulia Ferri S.r.l.', 'DVR Ufficio Sviluppo Software', 'basso', 'completato', '1.3', '2025-03-01', '2027-03-01', 15, 'Lavoro d''ufficio e sviluppo', '62.01.0'),
    (studio_uuid, client5_id, 'TechStart Innovations', 'DVR Open Space — Sede Principale', 'basso', 'bozza', '1.0', '2026-03-01', '2028-03-01', 22, 'Tech Company — Open Space', '72.19.0');

  -- COLF WORKERS
  insert into colf_workers (studio_id, client_id, full_name, fiscal_code, nationality, contract_type, hours_per_week, level, gross_salary, net_salary, start_date, status, inps_matricola) values
    (studio_uuid, client1_id, 'Maria Santos', 'SNTMRA75C42Z611K', 'Filippina', 'convivente', 40, 'CS', 1650.00, 1280.00, '2023-01-01', 'attivo', 'MI123456789'),
    (studio_uuid, client1_id, 'Anna Kowalski', 'KWLNNA82A48Z127Q', 'Polacca', 'non_convivente', 20, 'B', 720.00, 580.00, '2024-03-15', 'attivo', 'MI987654321');

  -- NOTIFICHE AI
  insert into ai_notifications (user_id, type, title, summary, action_label, date, priority) values
    (studio_uuid, 'rottamazione', 'Rottamazione-quinquies: nuova proroga', 'Il MEF ha prorogato la definizione agevolata al 30/06/2026. 3 tuoi clienti potrebbero beneficiarne per importi totali pari a €58.200.', 'Analizza Clienti', '2 ore fa', 'alta'),
    (studio_uuid, 'legge', 'Circolare AE n.5/2026 — Forfettario', 'Nuovi chiarimenti sulla determinazione dei ricavi nel regime forfettario. Aggiornare i conteggi per 12 clienti in regime forfettario.', 'Leggi Circolare', '5 ore fa', 'normale'),
    (studio_uuid, 'scadenza', 'IVA Trimestrale — 3 clienti in scadenza', 'Il versamento IVA del 1° trimestre scade il 16/05. Importo totale da versare: €14.630. Preparare i modelli F24.', 'Gestisci Scadenze', 'ieri', 'alta'),
    (studio_uuid, 'anomalia', 'Anomalia fatturazione — Pasticceria Bianchi', 'Rilevata discrepanza tra fatturato dichiarato (€195.000) e transazioni bancarie stimate. Differenza: €12.400. Verificare.', 'Verifica Cliente', '2 giorni fa', 'urgente'),
    (studio_uuid, 'bando', 'Bando PNRR Digitalizzazione PMI', '€25.000 di contributi a fondo perduto per digitalizzazione. Scadenza domande: 31/05/2026. 4 tuoi clienti risultano eligibili.', 'Verifica Eligibilità', '3 giorni fa', 'normale');

end $$;
