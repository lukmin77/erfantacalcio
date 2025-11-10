import prisma from '~/utils/db'

export async function getFantapunti(idTorneo: number) {
  const puntiHome = (
    await prisma.partite.groupBy({
      by: ['idSquadraH'],
      _sum: { punteggioH: true },
      where: { Calendario: { idTorneo } },
    })
  ).map((c) => ({
    idSquadra: c.idSquadraH ?? 0,
    fantapunti: c._sum.punteggioH?.toNumber() ?? 0,
  }))

  const puntiAway = (
    await prisma.partite.groupBy({
      by: ['idSquadraA'],
      _sum: { punteggioA: true },
      where: { Calendario: { idTorneo } },
    })
  ).map((c) => ({
    idSquadra: c.idSquadraA ?? 0,
    fantapunti: c._sum.punteggioA?.toNumber() ?? 0,
  }))

  return puntiHome.concat(puntiAway).reduce(
    (acc, curr) => {
      const idSquadra = curr.idSquadra ?? 0
      const fantapunti = curr.fantapunti ?? 0
      acc[idSquadra] = (acc[idSquadra] ?? 0) + fantapunti
      return acc
    },
    {} as Record<number, number>,
  )
}
