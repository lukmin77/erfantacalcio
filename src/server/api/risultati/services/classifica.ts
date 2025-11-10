import prisma from '~/utils/db'
import { Configurazione } from '~/config'

export async function UpdateClassifica(idSquadra: number, idTorneo: number) {
  const puntiH =
    (
      await prisma.partite.aggregate({
        _sum: { puntiH: true },
        where: {
          AND: [
            { Calendario: { idTorneo } },
            { idSquadraH: idSquadra },
            { hasMultaH: false },
          ],
        },
      })
    )._sum.puntiH ?? 0
  const vinteH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { gt: prisma.partite.fields.golA },
      Calendario: { idTorneo },
    },
  })
  const nulleH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { equals: prisma.partite.fields.golA },
      Calendario: { idTorneo },
    },
  })
  const perseH = await prisma.partite.count({
    where: {
      idSquadraH: idSquadra,
      golH: { lt: prisma.partite.fields.golA },
      Calendario: { idTorneo },
    },
  })
  const puntiA =
    (
      await prisma.partite.aggregate({
        _sum: { puntiA: true },
        where: {
          AND: [
            { Calendario: { idTorneo } },
            { idSquadraA: idSquadra },
            { hasMultaA: false },
          ],
        },
      })
    )._sum.puntiA ?? 0
  const vinteA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golA: { gt: prisma.partite.fields.golH },
      Calendario: { idTorneo },
    },
  })
  const nulleA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golH: { equals: prisma.partite.fields.golA },
      Calendario: { idTorneo },
    },
  })
  const perseA = await prisma.partite.count({
    where: {
      idSquadraA: idSquadra,
      golA: { lt: prisma.partite.fields.golH },
      Calendario: { idTorneo },
    },
  })

  const golFattiH =
    (
      await prisma.partite.aggregate({
        _sum: { golH: true },
        where: {
          AND: [{ Calendario: { idTorneo } }, { idSquadraH: idSquadra }],
        },
      })
    )._sum.golH ?? 0
  const golSubitiH =
    (
      await prisma.partite.aggregate({
        _sum: { golA: true },
        where: {
          AND: [{ Calendario: { idTorneo } }, { idSquadraH: idSquadra }],
        },
      })
    )._sum.golA ?? 0
  const golFattiA =
    (
      await prisma.partite.aggregate({
        _sum: { golA: true },
        where: {
          AND: [{ Calendario: { idTorneo } }, { idSquadraA: idSquadra }],
        },
      })
    )._sum.golA ?? 0
  const golSubitiA =
    (
      await prisma.partite.aggregate({
        _sum: { golH: true },
        where: {
          AND: [{ Calendario: { idTorneo } }, { idSquadraA: idSquadra }],
        },
      })
    )._sum.golH ?? 0

  const giocate = await prisma.partite.count({
    where: {
      Calendario: { AND: [{ idTorneo }, { hasGiocata: true }] },
      OR: [{ idSquadraA: idSquadra }, { idSquadraH: idSquadra }],
    },
  })
  const multeH = await prisma.partite.count({
    where: { idSquadraH: idSquadra, hasMultaH: true, Calendario: { idTorneo } },
  })
  const multeA = await prisma.partite.count({
    where: { idSquadraA: idSquadra, hasMultaA: true, Calendario: { idTorneo } },
  })

  await prisma.classifiche.updateMany({
    data: {
      punti: puntiH + puntiA,
      vinteCasa: vinteH,
      pareggiCasa: nulleH,
      perseCasa: perseH,
      vinteTrasferta: vinteA,
      pareggiTrasferta: nulleA,
      perseTrasferta: perseA,
      golFatti: golFattiH + golFattiA,
      golSubiti: golSubitiH + golSubitiA,
      differenzaReti: golFattiH + golFattiA - (golSubitiH + golSubitiA),
      giocate,
    },
    where: { idSquadra, idTorneo },
  })
  await prisma.utenti.update({
    data: { importoMulte: (multeH + multeA) * Configurazione.importoMulta },
    where: { idUtente: idSquadra },
  })
}

export function getPunti(
  hasClassifica: boolean,
  multa: boolean,
  gol1: number,
  gol2: number,
): number {
  return hasClassifica
    ? multa
      ? 0
      : gol1 > gol2
        ? 3
        : gol1 === gol2
          ? 1
          : 0
    : 0
}
