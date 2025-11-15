import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from 'typeorm'
import * as GiocatoriEntity from './Giocatori.js'
import * as SquadreSerieAEntity from './SquadreSerieA.js'
import * as UtentiEntity from './Utenti.js'

@Entity({ name: 'Trasferimenti' })
export class Trasferimenti {
  @PrimaryGeneratedColumn({ name: 'idTrasferimento' })
  idTrasferimento!: number

  @Column({ name: 'idGiocatore', type: 'int' })
  idGiocatore!: number

  @Column({ name: 'idSquadraSerieA', type: 'int', nullable: true })
  idSquadraSerieA!: number | null

  @Column({ name: 'dataAcquisto', type: 'timestamptz' })
  dataAcquisto!: Date

  @Column({ name: 'dataCessione', type: 'timestamptz', nullable: true })
  dataCessione!: Date | null

  @Column({ name: 'idSquadra', type: 'int', nullable: true })
  idSquadra!: number | null

  @Column({ name: 'costo', type: 'smallint' })
  costo!: number

  @Column({ name: 'stagione', type: 'varchar', length: 9 })
  stagione!: string

  @Column({ name: 'hasRitirato', type: 'boolean', default: false })
  hasRitirato!: boolean

  @Column({ name: 'nomeSquadraSerieA', type: 'varchar', length: 50, nullable: true })
  nomeSquadraSerieA!: string | null

  @Column({ name: 'nomeSquadra', type: 'varchar', length: 50, nullable: true })
  nomeSquadra!: string | null

  @Column({ name: 'media', type: 'decimal', precision: 9, scale: 2, nullable: true })
  media!: string | null

  @Column({ name: 'gol', type: 'smallint', nullable: true })
  gol!: number | null

  @Column({ name: 'assist', type: 'smallint', nullable: true })
  assist!: number | null

  @Column({ name: 'giocate', type: 'smallint', nullable: true })
  giocate!: number | null

  @ManyToOne(() => GiocatoriEntity.Giocatori, (g: GiocatoriEntity.Giocatori) => g.Trasferimenti)
  Giocatori!: Relation<GiocatoriEntity.Giocatori>

  @ManyToOne(() => SquadreSerieAEntity.SquadreSerieA, (s: SquadreSerieAEntity.SquadreSerieA) => s.Trasferimenti, { nullable: true })
  SquadreSerieA!: Relation<SquadreSerieAEntity.SquadreSerieA | null>

  @ManyToOne(() => UtentiEntity.Utenti, (u: UtentiEntity.Utenti) => u.Trasferimenti, { nullable: true })
  Utenti!: Relation<UtentiEntity.Utenti | null>
}
