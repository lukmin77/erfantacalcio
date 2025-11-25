# ErFantacalcio App

## Tecnologie e Principali

- **[Next.js](https://nextjs.org)**: Framework React per il rendering lato server e il routing.
- **[Typeorm](https://typeorm.io)**: ORM (Object-Relational Mapping) per la gestione del database SQL.
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

