import { AppDataSource } from '~/data-source'
import { Partite } from '~/server/db/entities'

export async function getFantapunti(idTorneo: number) {
  const loadPunti = async (idCol: string, scoreCol: string) => {
    return (
      await AppDataSource.getRepository(Partite)
        .createQueryBuilder('p')
        .select(`p.${idCol}`, 'id_squadra')
        .addSelect(`SUM(p.${scoreCol})`, 'fantapunti')
        .innerJoin('calendario', 'cal', 'cal.id_calendario = p.id_calendario')
        .where('cal.id_torneo = :idTorneo', { idTorneo })
        .groupBy(`p.${idCol}`)
        .getRawMany()
    ).map((r) => ({
      idSquadra: Number(r.idSquadra) || 0,
      fantapunti: Number(r.fantapunti) || 0,
    }))
  }

  const puntiHome = await loadPunti('id_squadra_home', 'punteggio_home')
  const puntiAway = await loadPunti('id_squadra_away', 'punteggio_away')

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
