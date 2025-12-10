# 🏆 ErFantacalcio

**ErFantacalcio** è una piattaforma web completa per la gestione di campionati di fantacalcio privati. Il sistema permette di gestire squadre, giocatori, formazioni, calendari, risultati e classifiche con un'interfaccia moderna e intuitiva.

## 📋 Indice

- [Caratteristiche Principali](#caratteristiche-principali)
- [Stack Tecnologico](#stack-tecnologico)
- [Struttura del Progetto](#struttura-del-progetto)
- [Installazione e Configurazione](#installazione-e-configurazione)
- [Variabili d'Ambiente](#variabili-dambiente)
- [Funzionalità](#funzionalità)
- [Architettura](#architettura)
- [Database](#database)
- [API e Backend](#api-e-backend)
- [Scripts Disponibili](#scripts-disponibili)

---

## ✨ Caratteristiche Principali

- 👤 **Sistema di autenticazione** con gestione ruoli (Admin/Presidente)
- 🏆 **Gestione completa dei tornei** e delle stagioni
- 📊 **Classifiche in tempo reale** con statistiche dettagliate
- ⚽ **Gestione giocatori** con statistiche, voti e prestazioni
- 📅 **Calendario partite** con risultati e tabellini
- 💰 **Sistema economico** per gestione budget e trasferimenti
- 📈 **Statistiche avanzate** per giocatori e squadre
- 📸 **Gestione maglie** personalizzate per ogni squadra
- 📄 **Albo d'oro** e storico delle stagioni
- 📱 **Interfaccia responsive** ottimizzata per mobile e desktop

---

## 🛠️ Stack Tecnologico

### Frontend
- **[Next.js 14](https://nextjs.org)** - Framework React con App Router
- **[React 18](https://react.dev)** - Libreria per interfacce utente
- **[TypeScript](https://www.typescriptlang.org/)** - Linguaggio tipizzato
- **[Material-UI v5](https://mui.com/)** - Libreria di componenti UI
- **[MUI X Data Grid](https://mui.com/x/react-data-grid/)** - Tabelle avanzate
- **[MUI X Charts](https://mui.com/x/react-charts/)** - Grafici e visualizzazioni

### Backend
- **[tRPC](https://trpc.io)** - API type-safe end-to-end
- **[NextAuth.js](https://next-auth.js.org)** - Sistema di autenticazione
- **[TypeORM](https://typeorm.io)** - ORM per PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Database relazionale
- **[Zod](https://zod.dev/)** - Validazione e schema dei dati

### Utilità
- **[TanStack Query](https://tanstack.com/query)** - Data fetching e caching
- **[Day.js](https://day.js.org/)** - Manipolazione date
- **[Lodash](https://lodash.com/)** - Utility functions
- **[SuperJSON](https://github.com/blitz-js/superjson)** - Serializzazione JSON avanzata
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Storage file (immagini, documenti)
- **[Resend](https://resend.com/)** - Invio email transazionali
- **[crypto-js](https://www.npmjs.com/package/crypto-js)** - Crittografia

---

## 📁 Struttura del Progetto

```
erfantacalcio/
├── src/
│   ├── app/                      # App Router di Next.js
│   │   ├── (admin)/             # Pagine amministrazione
│   │   │   ├── avvioStagione/   # Setup nuova stagione
│   │   │   ├── calendario/      # Gestione calendario
│   │   │   ├── giocatori/       # CRUD giocatori
│   │   │   ├── presidenti/      # Gestione utenti
│   │   │   ├── risultati/       # Inserimento risultati
│   │   │   ├── uploadVoti/      # Caricamento voti
│   │   │   └── voti/            # Gestione voti
│   │   ├── (user)/              # Pagine utente
│   │   │   ├── albo/            # Albo d'oro
│   │   │   ├── documenti/       # Documenti e regolamenti
│   │   │   ├── economia/        # Gestione budget
│   │   │   ├── formazione/      # Crea formazione
│   │   │   ├── formazioni/      # Visualizza formazioni
│   │   │   ├── foto/            # Galleria foto
│   │   │   ├── maglia/          # Editor maglie
│   │   │   ├── squadra/         # Rosa giocatori
│   │   │   ├── statistiche_giocatore/   # Stats individuali
│   │   │   ├── statistiche_giocatori/   # Stats complessive
│   │   │   └── tabellini/       # Dettagli partite
│   │   ├── login/               # Autenticazione
│   │   ├── layout.tsx           # Layout principale
│   │   └── page.tsx             # Homepage
│   ├── components/              # Componenti React riutilizzabili
│   │   ├── appbar/              # Barra navigazione
│   │   ├── autocomplete/        # Input autocomplete
│   │   ├── cardPartite/         # Card risultati partite
│   │   ├── giocatori/           # Componenti giocatori
│   │   ├── home/                # Componenti homepage
│   │   ├── maglia/              # Editor maglie
│   │   ├── modal/               # Modali
│   │   ├── navigation/          # Menu navigazione
│   │   └── squadra/             # Componenti squadra
│   ├── server/                  # Backend logic
│   │   ├── api/                 # tRPC routers
│   │   │   ├── albo/            # API albo d'oro
│   │   │   ├── calendario/      # API calendario
│   │   │   ├── classifica/      # API classifiche
│   │   │   ├── formazione/      # API formazioni
│   │   │   ├── giocatori/       # API giocatori
│   │   │   ├── nuovastagione/   # API setup stagione
│   │   │   ├── partita/         # API partite
│   │   │   ├── profilo/         # API profilo utente
│   │   │   ├── risultati/       # API risultati
│   │   │   ├── squadre/         # API squadre
│   │   │   ├── squadreSerieA/   # API squadre Serie A
│   │   │   ├── tornei/          # API tornei
│   │   │   ├── trasferimenti/   # API trasferimenti
│   │   │   ├── voti/            # API voti
│   │   │   ├── root.ts          # Root router
│   │   │   └── trpc.ts          # tRPC setup
│   │   ├── db/                  # Database entities (TypeORM)
│   │   │   └── entities/        # Entità database
│   │   ├── auth.ts              # Configurazione NextAuth
│   │   └── utils/               # Utility server-side
│   ├── schemas/                 # Zod schemas per validazione
│   │   ├── calendario/
│   │   ├── classifica/
│   │   ├── giocatore/
│   │   ├── presidente/
│   │   └── messageSchema.ts
│   ├── types/                   # TypeScript types e interfaces
│   │   ├── common/
│   │   ├── giocatori/
│   │   ├── risultati/
│   │   ├── squadre/
│   │   ├── trasferimenti/
│   │   └── voti/
│   ├── utils/                   # Utility functions
│   │   ├── api.ts               # Client API
│   │   ├── bergerTables.ts      # Generazione calendari
│   │   ├── blobVercelUtils.ts   # Gestione file storage
│   │   ├── datatable.ts         # Utility DataGrid
│   │   ├── dateUtils.ts         # Manipolazione date
│   │   ├── enums.ts             # Enumerazioni
│   │   ├── hashPassword.ts      # Hashing password
│   │   ├── helper.ts            # Helper generici
│   │   ├── numberUtils.ts       # Utility numeriche
│   │   └── stringUtils.ts       # Utility stringhe
│   ├── styles/                  # Stili globali
│   ├── theme/                   # Tema Material-UI
│   ├── config.ts                # Configurazione applicazione
│   ├── data-source.ts           # Configurazione TypeORM
│   ├── env.js/mjs               # Validazione env vars
│   └── ProvidersWrapper.tsx     # Provider React
├── public/                      # File statici
│   ├── docs/                    # Documenti pubblici
│   ├── images/                  # Immagini
│   │   ├── fotoprofili/         # Foto profilo presidenti
│   │   └── maglie/              # Loghi maglie
│   └── voti/                    # File voti CSV
├── backup_db/                   # Backup database e migrations
├── logs/                        # File di log
├── next.config.cjs              # Configurazione Next.js
├── tsconfig.json                # Configurazione TypeScript
├── tsconfig.typeorm.json        # TypeScript per TypeORM
├── eslint.config.js             # Configurazione ESLint
└── package.json                 # Dipendenze e scripts
```

---

## 🚀 Installazione e Configurazione

### Prerequisiti

- **Node.js** >= 18.17.0
- **npm** >= 10.2.3
- **PostgreSQL** >= 14

### 1. Clona il repository

```bash
git clone https://github.com/lukmin77/erfantacalcio.git
cd erfantacalcio
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura il database

Crea un database PostgreSQL e configura le variabili d'ambiente (vedi sezione successiva).

### 4. Esegui le migrations

```bash
npm run migration:run:local
```

### 5. Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:8080`

---

## 🔐 Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/erfantacalcio"
TYPEORM_HOST="localhost"
TYPEORM_PORT="5432"
TYPEORM_USERNAME="user"
TYPEORM_PASSWORD="password"
TYPEORM_DATABASE="erfantacalcio"
TYPEORM_SYNCHRONIZE="false"
TYPEORM_LOGGING="true"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:8080"

# Configurazione Stagione
NEXT_PUBLIC_STAGIONE="2024-2025"
NEXT_PUBLIC_STAGIONEPRECEDENTE="2023-2024"
NEXT_PUBLIC_RECORDCOUNT="20"

# Configurazione Economica
NEXT_PUBLIC_MULTA="10"
NEXT_PUBLIC_QUOTA_ANNUALE="120"

# URL Campioncini (immagini giocatori)
NEXT_PUBLIC_CAMPIONCINO="https://content.fantacalcio.it/web/campioncini/small/"
NEXT_PUBLIC_CAMPIONCINO_SMALL="https://content.fantacalcio.it/web/campioncini/small/"

# Locale
NEXT_PUBLIC_LOCALE="it-IT"

# Bonus e Modificatori
NEXT_PUBLIC_FATTORE_CASALINGO="0"
NEXT_PUBLIC_BONUS_GOL="3"
NEXT_PUBLIC_BONUS_ASSIST="1"
NEXT_PUBLIC_BONUS_GOLSUBITO="-1"
NEXT_PUBLIC_BONUS_AMMONIZIONE="-0.5"
NEXT_PUBLIC_BONUS_ESPULSIONE="-1"
NEXT_PUBLIC_BONUS_RIGOREPARATO="3"
NEXT_PUBLIC_BONUS_RIGORESBAGLIATO="-3"
NEXT_PUBLIC_BONUS_AUTOGOL="-2"
NEXT_PUBLIC_BONUS_SENZA_VOTO="0"

# Bonus Modulo
NEXT_PUBLIC_BONUS_MODULO="true"
NEXT_PUBLIC_BONUS_MODULO_541="1.5"
NEXT_PUBLIC_BONUS_MODULO_451="1"
NEXT_PUBLIC_BONUS_MODULO_532="0.5"
NEXT_PUBLIC_BONUS_MODULO_442="0"
NEXT_PUBLIC_BONUS_MODULO_352="-0.5"
NEXT_PUBLIC_BONUS_MODULO_433="-1"
NEXT_PUBLIC_BONUS_MODULO_343="-1.5"

# Regole Formazione
NEXT_PUBLIC_SOSTITUZIONI="6"
NEXT_PUBLIC_PERCENTUALE_MINIMA_GIOCATE="30"

# Vercel Blob Storage (opzionale)
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Email (Resend - opzionale)
RESEND_API_KEY="your-resend-api-key"
```

---

## 🎮 Funzionalità

### Area Amministrazione (Admin)

#### 🏁 Avvio Stagione
- Creazione nuova stagione
- Importazione giocatori Serie A da CSV
- Configurazione tornei
- Assegnazione squadre ai presidenti

#### 📅 Gestione Calendario
- Generazione automatica calendario con algoritmo Berger
- Gestione giornate e turni
- Calendario andata e ritorno

#### ⚽ Gestione Giocatori
- CRUD completo giocatori
- Importazione massiva da CSV
- Aggiornamento statistiche
- Gestione trasferimenti

#### 👥 Gestione Presidenti
- Creazione e gestione utenti
- Assegnazione ruoli (Admin/Presidente)
- Reset password
- Gestione permessi

#### 📊 Gestione Risultati
- Inserimento risultati partite
- Calcolo automatico punteggi
- Aggiornamento classifiche
- Gestione bonus/malus

#### 📤 Upload Voti
- Caricamento voti da file CSV
- Upload file su Vercel Blob Storage
- Validazione e parsing dati
- Associazione automatica voti-giocatori

#### ✏️ Gestione Voti
- Modifica manuale voti
- Correzione errori
- Statistiche voti per giornata
- Reset voti

### Area Utente (Presidente)

#### 🏠 Homepage
- Classifica in tempo reale
- Prossime partite
- Risultati recenti
- Squadre partecipanti

#### 🏆 Albo d'Oro
- Storico vincitori
- Statistiche stagioni precedenti
- Record e primati

#### 📄 Documenti
- Regolamento
- Guide
- Documentazione varia

#### 💰 Economia
- Budget disponibile
- Storico trasferimenti
- Saldo cassa
- Multe e bonus

#### 📋 Formazione
- Creazione formazione settimanale
- Drag & drop giocatori
- Validazione modulo
- Preview punteggio stimato

#### 👀 Visualizza Formazioni
- Formazioni di tutte le squadre
- Confronto formazioni
- Statistiche formazione

#### 📸 Galleria Foto
- Album fotografici
- Upload immagini
- Condivisione momenti

#### 👕 Editor Maglia
- Personalizzazione maglia squadra
- Scelta colori
- Preview in tempo reale

#### 🏃 Rosa Squadra
- Lista giocatori di proprietà
- Statistiche individuali
- Valori di mercato

#### 📈 Statistiche Giocatore
- Dettaglio prestazioni singolo giocatore
- Grafici andamento
- Storico voti

#### 📊 Statistiche Giocatori
- Classifica marcatori
- Migliori/peggiori per ruolo
- Medie voto
- Presenze

#### 📋 Tabellini
- Dettaglio partite giocate
- Formazioni utilizzate
- Eventi partita (gol, assist, ammonizioni)

---

## 🏗️ Architettura

### Pattern e Principi

- **App Router di Next.js 14** per routing file-based
- **Server Components** per ottimizzazione performance
- **tRPC** per comunicazione type-safe client-server
- **TypeORM Active Record** per interazione con database
- **Zod schemas** per validazione runtime
- **NextAuth** per gestione sessioni e autenticazione

### Flusso di Autenticazione

1. Login tramite credentials (email + password)
2. Password hashate con MD5 + salt
3. NextAuth crea sessione JWT
4. Middleware protegge route admin/user
5. Session contiene: user, ruolo, idSquadra, presidente

### Struttura API (tRPC)

```typescript
appRouter
├── albo          // Albo d'oro
├── calendario    // Gestione calendario
├── classifica    // Classifiche
├── formazione    // Formazioni
├── giocatori     // CRUD giocatori
├── nuovastagione // Setup stagione
├── partita       // Dettagli partite
├── profilo       // Profilo utente
├── risultati     // Risultati
├── squadre       // Squadre fantacalcio
├── squadreSerieA // Squadre Serie A reali
├── tornei        // Tornei
├── trasferimenti // Mercato
└── voti          // Voti giocatori
```

---

## 🗄️ Database

### Entità Principali

- **Utente** - Utenti del sistema (presidenti/admin)
- **Squadra** - Squadre fantacalcio
- **Giocatore** - Giocatori Serie A
- **SquadraSerieA** - Squadre Serie A reali
- **Torneo** - Tornei/campionati
- **Giornata** - Giornate di campionato
- **Partita** - Singole partite
- **Formazione** - Formazioni settimanali
- **Voto** - Voti giocatori per giornata
- **Trasferimento** - Operazioni di mercato
- **StatsP/D/C/A** - Statistiche per ruolo (Portiere/Difensore/Centrocampista/Attaccante)

### Relazioni

- Utente → Squadra (1:1)
- Squadra → Giocatori (1:N)
- Giocatore → SquadraSerieA (N:1)
- Torneo → Giornate (1:N)
- Giornata → Partite (1:N)
- Partita → Formazioni (1:2)
- Giocatore → Voti (1:N)
- Giocatore → Trasferimenti (1:N)

---

## 📡 API e Backend

### tRPC Procedures

Ogni router espone procedure di tipo:
- **query** - Lettura dati (GET-like)
- **mutation** - Modifica dati (POST/PUT/DELETE-like)

### Middleware di Autenticazione

- `publicProcedure` - Accesso pubblico
- `protectedProcedure` - Richiede autenticazione
- `adminProcedure` - Richiede ruolo admin

### Esempio Procedure

```typescript
export const listGiocatori = protectedProcedure
  .input(z.object({ idSquadra: z.number() }))
  .query(async ({ input }) => {
    // Logic per recuperare giocatori
  })

export const updateGiocatore = adminProcedure
  .input(giocatoreSchema)
  .mutation(async ({ input }) => {
    // Logic per aggiornare giocatore
  })
```

---

## 📜 Scripts Disponibili

### Sviluppo

```bash
npm run dev          # Avvia server sviluppo (porta 8080)
npm run build        # Build per produzione
npm start            # Avvia server produzione
npm run lint         # Lint del codice
npm run format       # Formattazione con Prettier
```

### Database Migrations (Locale)

```bash
npm run build:ts                    # Compila TypeScript per TypeORM
npm run migration:create:local      # Crea nuova migration
npm run migration:generate:local    # Genera migration da entities
npm run migration:run:local         # Esegue migrations pending
npm run migration:revert:local      # Reverte ultima migration
npm run migration:show:local        # Mostra stato migrations
```

### Database Migrations (Produzione)

```bash
npm run migration:create:prod
npm run migration:generate:prod
npm run migration:run:prod
npm run migration:revert:prod
npm run migration:show:prod
```

---

## 👨‍💻 Autore

**Luciano Minni**
- GitHub: [@lukmin77](https://github.com/lukmin77)

---

## 📄 Licenza

Progetto privato - Tutti i diritti riservati

---

## 🤝 Contribuire

Questo è un progetto privato. Per suggerimenti o segnalazioni contattare l'autore.

---

## 📞 Supporto

Per assistenza o domande, contattare l'amministratore del sistema.

