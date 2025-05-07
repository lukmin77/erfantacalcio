# ErFantacalcio App

## Tecnologie e Principali

- **[Next.js](https://nextjs.org)**: Framework React per il rendering lato server e il routing.
- **[Prisma](https://prisma.io)**: ORM (Object-Relational Mapping) per la gestione del database SQL.
- **[NextAuth.js](https://next-auth.js.org)**: Libreria per l'autenticazione in Next.js con supporto per vari fornitori di autenticazione.
- **[tRPC](https://trpc.io)**: Framework per la comunicazione client-server tramite tipi TypeScript.
- **[Winston](https://www.npmjs.com/package/winston)**: Libreria per la gestione dei log e del logging nel progetto.
- **Zod**: Libreria per la validazione dei dati in TypeScript.
- **Material-UI**: Libreria di componenti React per un'interfaccia utente moderna.

## Librerie Utilizzate

- **React**: Libreria JavaScript per la creazione di interfacce utente.
- **TypeScript**: Linguaggio di programmazione tipizzato che si integra bene con React e Next.js.
- **dotenv**: Per caricare variabili d'ambiente da un file `.env`.

## Come iniziare

1. Clona il repository.
2. Esegui `npm install` per installare le dipendenze.
3. Crea un file `.env` per configurare le variabili d'ambiente necessarie.
4. Esegui `npm run dev` per avviare il server di sviluppo.

## Struttura del Progetto

- **app/**: Contiene le pagine 'client' della web app
- **pages/api**: Contiene le api per trpc e auth.
- **components/**: Contiene i componenti React riutilizzabili.
- **server/**: Contiene la parte server come le chiamate al database
- **styles/**: Contiene i file di stile per l'applicazione.
- **theme/**: Contiene il tema della web app: colori, stili.

## Comandi principali

1. Esegui `npm install` per installare le dipendenze.
2. Esegui `npm run dev` per avviare il server di sviluppo.
3. Esegui `npm run build` per build della web app.
4. Esegui `npx prisma db pull` per eseguire il pull del database.
5. Esegui `npx prisma generate` per generare il file schema.prisma.
6. Esegui `npx prisma migrate dev --create-only --name <NAME_OF_YOUR_MIGRATION>` per generare una migrazione vuota

## How adding Prisma Migrate to an existing project

https://www.prisma.io/docs/orm/prisma-migrate/getting-started

## come fare il restore dal db sql production stagione 2023-2024 senza perdere dati

1. restore from sql server production
2. recreate erfantacalcioShadow
3. npx prisma migrate resolve --applied 0_init
4. esegui manualmente gli scripts sql
5. npx prisma migrate resolve --applied 20240314143340_classifiche
6. npx prisma migrate resolve --applied 20240314143341_albotrofei
7. npx prisma migrate resolve --applied 20240314143342_utenti
8. npx prisma migrate resolve --applied 20240314143343_drop_tables
9. npx prisma migrate resolve --applied 20240314143345_utenti_index
10. npx prisma migrate resolve --applied 20240314143346_update_utenti
11. npx prisma migrate resolve --applied 20240509093856_table_flownewseason
12. npx prisma migrate resolve --applied 20240509123636_insert_table_flownewseason
13. npx prisma migrate resolve --applied 20240523102306_voti_add_field_riserva
14. npx prisma migrate resolve --applied 20240523121121_voti_remove_fields_riserve_tribuna
15. npx prisma migrate dev per verificare l'allineamento
16.
