import Logger from "~/lib/logger";
import { Configurazione } from "~/config"
import { chiudiTrasferimentoGiocatore, getCalendarioByTorneo, getTornei } from "./common";
import { generateUniqueRandomNumbers } from "~/utils/numberUtils";
import { toLocaleDateTime } from "~/utils/dateUtils";
import { type Partita, RoundRobin4, RoundRobin8 } from "~/utils/bergerTables";
import { type iMessage } from "~/types/nuovastagione";

import prisma from "~/utils/db";

import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";

export const nuovastagioneRouter = createTRPCRouter({
  getFaseAvvio: adminProcedure.query(async () => {
    try {
      const fase = await prisma.flowNewSeasosn.findFirst({
        where: {
          active: false,
        },
        orderBy: {
          idFase: "asc",
        },
      });
      return fase ? fase.idFase : 6;
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  chiudiStagione: adminProcedure.mutation<iMessage>(async () => {
    try {
      if ((await checkVotiUltimaGiornata()) === false) {
        Logger.warn(
          "Impossibile chiudere la stagione, calendario non completato"
        );
        return {
          isError: true,
          message:
            "Impossibile chiudere la stagione, calendario non completato",
        };
      } else {
        const giocatoritrasferimenti = await prisma.trasferimenti.findMany({
          select: { idGiocatore: true },
          distinct: ["idGiocatore"],
          where: {
            AND: [
              { dataCessione: null },
              { stagione: Configurazione.stagione },
            ],
          },
          take: 30
        });
        const promises = giocatoritrasferimenti.map(async (c) => {
          await chiudiTrasferimentoGiocatore(c.idGiocatore, true);
        });
        await Promise.all(promises);

        if (giocatoritrasferimenti.length !== 30){
          await updateFase(1);
          Logger.info(
            `Chiusura trasferimenti stagione ${Configurazione.stagione} completato`
          );
          return {
            isError: false,
            message: `Chiusura trasferimenti stagione ${Configurazione.stagione} completato`,
          };
        }
        else{
          Logger.info(
            `Chiusura trasferimenti stagione ${Configurazione.stagione} ancora incompleto`
          );
          return {
            isError: true,
            message: `Chiusura trasferimenti stagione ${Configurazione.stagione} ancora incompleto`,
          };
        }
      }
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  preparaStagione: adminProcedure.mutation<iMessage>(async () => {
    try {
      if ((await checkVotiUltimaGiornata()) === false) {
        Logger.warn(
          "Impossibile preparare la nuova stagione, calendario non completato"
        );
        return {
          isError: true,
          message:
            "Impossibile preparare la nuova stagione, calendario non completato",
        };
      } else if ((await checkVerificaPartiteGiocate()) === false) {
        Logger.warn(
          "Impossibile preparare la nuova stagione: ci sono ancora partite da giocare"
        );
        return {
          isError: true,
          message:
            "Impossibile preparare la nuova stagione: ci sono ancora partite da giocare",
        };
      } else {
        await prisma.$transaction([
          prisma.classifiche.deleteMany(),
          prisma.voti.deleteMany(),
          prisma.formazioni.deleteMany(),
          prisma.partite.deleteMany(),
          prisma.calendario.updateMany({
            data: {
              hasGiocata: false,
              data: toLocaleDateTime(new Date()),
              dataFine: toLocaleDateTime(new Date()),
            },
          })
        ]);

        await updateFase(2);

        Logger.info(
          `Azzeramento dati della scorsa stagione ${Configurazione.stagione}`
        );
        return {
          isError: false,
          message: `Azzeramento dati della scorsa stagione ${Configurazione.stagione}`,
        };
      }
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  eliminaStatistiche: adminProcedure.mutation<iMessage>(async () => {
    try {
      if ((await checkVotiUltimaGiornata()) === false) {
        Logger.warn(
          "Impossibile preparare la nuova stagione, calendario non completato"
        );
        return {
          isError: true,
          message:
            "Impossibile preparare la nuova stagione, calendario non completato",
        };
      } else {
        await prisma.$transaction([
          prisma.statsP.deleteMany(),
          prisma.statsD.deleteMany(),
          prisma.statsC.deleteMany(),
          prisma.statsA.deleteMany(),
        ]);

        await updateFase(2);

        Logger.info(
          `Azzeramento dati della scorsa stagione ${Configurazione.stagione}`
        );
        return {
          isError: false,
          message: `Azzeramento dati della scorsa stagione ${Configurazione.stagione}`,
        };
      }
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  preparaIdSquadre: adminProcedure.mutation<iMessage>(async () => {
    try {
      //get utenti
      const utenti = await prisma.utenti.findMany({
        orderBy: { idUtente: "asc" },
      });
      //creazione duplicati utenti
      const startNewId = 10;
      const promises = utenti.map(async (c) => {
        const newIdUtente = c.idUtente + startNewId;
        const username = c.username + "_temp";

        await prisma.utenti.create({
          data: {
            idUtente: newIdUtente,
            username: username,
            pwd: c.pwd,
            adminLevel: c.adminLevel,
            presidente: c.presidente,
            mail: c.mail,
            nomeSquadra: c.nomeSquadra,
            foto: c.foto,
            importoBase: 100,
            importoMulte: 0,
            importoMercato: 0,
            fantaMilioni: 600,
            Campionato: c.Campionato,
            Champions: c.Champions,
            Secondo: c.Secondo,
            Terzo: c.Terzo,
            lockLevel: c.lockLevel,
          },
        });
      });
      await Promise.all(promises);
      Logger.info("creati nuovi utenti temporanei");

      //sorteggio nuovi idutente
      const uniqueRandomNumbers = generateUniqueRandomNumbers(
        startNewId + 1,
        startNewId + 8,
        8
      );
      Logger.info("sorteggiati nuovi idutente", uniqueRandomNumbers);

      for (let i = 0; i <= 7; i++) {
        //get utente from numeri estratti a partire dal primo
        const user = await prisma.utenti.findUnique({
          where: { idUtente: uniqueRandomNumbers[i] },
        });
        //save utente where idutente = index
        await prisma.utenti.update({
          data: {
            username: `${user?.username.replace("_temp", "_new")}`,
            adminLevel: user?.adminLevel,
            lockLevel: user?.lockLevel,
            mail: user?.mail,
            nomeSquadra: user?.nomeSquadra,
            presidente: user?.presidente,
            foto: user?.foto,
            pwd: user?.pwd,
            Campionato: user?.Campionato,
            Champions: user?.Champions,
            fantaMilioni: user?.fantaMilioni,
            importoBase: user?.importoBase,
            importoMercato: user?.importoMercato,
            importoMulte: user?.importoMulte,
            Secondo: user?.Secondo,
            Terzo: user?.Terzo,
          },
          where: {
            idUtente: i + 1,
          },
        });
        Logger.info(
          `aggiornato utente: ${i + 1} con utente estratto: ${
            uniqueRandomNumbers[i]
          }`
        );
      }

      //eliminazione utenti con idutente > 8
      await prisma.utenti.deleteMany({
        where: { idUtente: { gt: 8 } },
      });
      Logger.info("eliminati utenti con idutente > 8");

      //aggiorno gli username togliendo il '_new'
      await prisma.$transaction([
        prisma.$executeRaw`UPDATE "Utenti" SET username=REPLACE(username, '_new', '');`,
      ]);
      Logger.info("aggiornati usernames utenti");

      await updateFase(3);

      return { isError: false, message: "Sorteggio nuove squadre completato" };
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  creaClassifiche: adminProcedure.mutation<iMessage>(async () => {
    try {
      if ((await checkCountClassifiche()) === false) {
        Logger.warn(
          "Impossibile procedere con la nuova Stagione, classifiche già inserite"
        );
        return {
          isError: true,
          message:
            "Impossibile procedere con la nuova Stagione, classifiche già inserite",
        };
      } else {
        const tornei = await getTornei();

        //campionato
        let idTorneo = tornei.find(
          (c) => c.nome.toLowerCase() === "campionato"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error("Nessun torneo trovato con il nome 'campionato'.");
        }
        await creaClassifica(idTorneo, 1, 8);

        //champions girone A
        idTorneo = tornei.find(
          (c) =>
            c.nome.toLowerCase() === "champions" &&
            c.gruppoFase?.toUpperCase() === "A"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' girone 'A'."
          );
        }
        await creaClassifica(idTorneo, 1, 4);

        //champions girone B
        idTorneo = tornei.find(
          (c) =>
            c.nome.toLowerCase() === "champions" &&
            c.gruppoFase?.toUpperCase() === "B"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' e fase girone 'B'."
          );
        }
        await creaClassifica(idTorneo, 5, 8);

        await updateFase(5);

        Logger.info(
          `Le classifiche della stagione ${Configurazione.stagione} sono state create`
        );
        return {
          isError: false,
          message: `Le classifiche della stagione ${Configurazione.stagione} sono state create`,
        };
      }
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),

  creaPartite: adminProcedure.mutation<iMessage>(async () => {
    try {
      if ((await checkCountPartite()) === false) {
        Logger.warn(
          "Impossibile procedere con la nuova Stagione, partite già inserite"
        );
        return {
          isError: true,
          message:
            "Impossibile procedere con la nuova Stagione, partite già inserite",
        };
      } else {
        const tornei = await getTornei();

        //campionato
        let idTorneo = tornei.find(
          (c) => c.nome.toLowerCase() === "campionato"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error("Nessun torneo trovato con il nome 'campionato'.");
        }
        await creaPartite(8, idTorneo, true);

        //champions girone A
        idTorneo = tornei.find(
          (c) =>
            c.nome.toLowerCase() === "champions" &&
            c.gruppoFase?.toUpperCase() === "A"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' girone 'A'."
          );
        }
        await creaPartite(4, idTorneo, false);

        //champions girone B
        idTorneo = tornei.find(
          (c) =>
            c.nome.toLowerCase() === "champions" &&
            c.gruppoFase?.toUpperCase() === "B"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' e fase girone 'B'."
          );
        }
        await creaPartite(4, idTorneo, false, 4);

        //Semifinali andata
        idTorneo = tornei.find(
          (c) =>
            c.nome.toLowerCase() === "champions" &&
            c.gruppoFase?.toLowerCase() === "semifinali andata"
        )?.idTorneo;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' e fase 'semifinali andata'."
          );
        }
        await creaPartiteEmpty(2, idTorneo);

        //Semifinali ritorno
        idTorneo =
          tornei.find(
            (c) =>
              c.nome.toLowerCase() === "champions" &&
              c.gruppoFase?.toLowerCase() === "semifinali ritorno"
          )?.idTorneo ?? 0;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' e fase 'semifinali ritorno'."
          );
        }
        await creaPartiteEmpty(2, idTorneo);

        //Finale
        idTorneo =
          tornei.find(
            (c) =>
              c.nome.toLowerCase() === "champions" &&
              c.gruppoFase?.toLowerCase() === "finale"
          )?.idTorneo ?? 0;
        if (!idTorneo) {
          throw new Error(
            "Nessun torneo trovato con il nome 'champions' e fase 'finale'."
          );
        }
        await creaPartiteEmpty(1, idTorneo);

        await updateFase(4);

        Logger.info(
          `Le partite della stagione ${Configurazione.stagione} sono state create`
        );
        return {
          isError: false,
          message: `Le partite della stagione ${Configurazione.stagione} sono state create`,
        };
      }
    } catch (error) {
      Logger.error("Si è verificato un errore", error);
      throw error;
    }
  }),
});

async function updateFase(idFase: number) {
  await prisma.flowNewSeasosn.updateMany({
    where: {
      idFase: idFase
    },
    data: {
      active: true,
      data: toLocaleDateTime(new Date())
    }
  });
}

async function creaPartite(squadre: number, idTorneo: number, evaluateLastGirone: boolean, idAccumulate = 0) {
  let roundRobin: Partita[] | undefined;
  
  if (squadre === 8) {
    roundRobin = RoundRobin8();
    Logger.info('creato roundrobin 8 squadre');
  } else if (squadre === 4) {
    roundRobin = RoundRobin4();
    Logger.info('creato roundrobin 4 squadre');
  } else {
    Logger.error('Numero di squadre non supportato');
    throw new Error("Numero di squadre non supportato");
  }

  const calendario = await getCalendarioByTorneo(idTorneo);
  if (calendario && roundRobin) {
    let index = 1;
    let previousGirone = calendario[0]?.girone;
    const lastGirone = calendario[calendario.length - 1]?.girone;

    for (const c of calendario) {
      if (c.girone !== previousGirone) {
        previousGirone = c.girone!;
        index = 1;
      }

      const matches = roundRobin.filter(x => x.giornata === index);

      for (const p of matches) {
        let fattoreCasalingo = Configurazione.bonusFattoreCasalingo > 0;
        if (evaluateLastGirone && lastGirone === c.girone && fattoreCasalingo) {
          fattoreCasalingo = (calendario[calendario.length - 1]?.girone ?? 0) % 2 === 0;
        }

        await prisma.partite.createMany({
          data: [{
            idCalendario: c.idCalendario,
            idSquadraH: c.girone! % 2 === 0 ? p.squadraHome + idAccumulate : p.squadraAway + idAccumulate,
            idSquadraA: c.girone! % 2 === 0 ? p.squadraAway + idAccumulate : p.squadraHome + idAccumulate,
            fattoreCasalingo: fattoreCasalingo,
            golH: null,
            golA: null,
            hasMultaH: false,
            hasMultaA: false,
            punteggioH: null,
            punteggioA: null,
            puntiH: null,
            puntiA: null
          }]
        });
      }

      index++;
    }

    Logger.info(`create partite calendario per idTorneo: ${idTorneo}`);
  }
}


async function creaClassifica(idTorneo: number, from: number, to: number) {
  const squadreData = [];

  for (let i = from; i <= to; i++) {
    squadreData.push({
      idSquadra: i,
      idTorneo: idTorneo,
      differenzaReti: 0,
      giocate: 0,
      golFatti: 0,
      golSubiti: 0,
      pareggiCasa: 0,
      pareggiTrasferta: 0,
      perseCasa: 0,
      perseTrasferta: 0,
      punti: 0,
      vinteCasa: 0,
      vinteTrasferta: 0,
    });
  }

  await prisma.classifiche.createMany({
    data: squadreData
  });

  Logger.info(`create classifiche per idTorneo: ${idTorneo}`);
}

async function creaPartiteEmpty(partite: number, idTorneo: number) {

  const calendario = await getCalendarioByTorneo(idTorneo);
  if (calendario?.[0]) {
    for (let i = 0; i < partite; i++) {
      await prisma.partite.createMany({
        data: [{
          idCalendario: calendario[0]?.idCalendario,
          idSquadraH: null,
          idSquadraA: null,
          fattoreCasalingo: Configurazione.bonusFattoreCasalingo > 0 ? true : false,
          golH: null,
          golA: null,
          hasMultaH: false,
          hasMultaA: false,
          punteggioH: null,
          punteggioA: null,
          puntiH: null,
          puntiA: null
        }]
      });
    }
    Logger.info(`create partite calendario per idTorneo: ${idTorneo}`);
  }
}

async function checkVotiUltimaGiornata() {
  return ((await prisma.voti.count({ where: { Calendario: { giornataSerieA: 38 } } })) > 0);
}

async function checkCountPartite() {
  return ((await prisma.partite.count()) === 0);
}

async function checkCountClassifiche() {
  return ((await prisma.classifiche.count()) === 0);
}

async function checkVerificaPartiteGiocate() {
  return ((await prisma.calendario.count({
    where:
    {
      AND: [
        { hasGiocata: false },
        { idTorneo: { 'lte': 6 } }
      ]
    }
  })) === 0);
}