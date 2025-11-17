import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation, JoinColumn, BaseEntity } from 'typeorm'
import { Giocatori } from './Giocatori.js'
import { SquadreSerieA } from './SquadreSerieA.js'
import { Utenti } from './Utenti.js'

@Entity({ name: 'Trasferimenti' })
export class Trasferimenti extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idTrasferimento' })
  idTrasferimento!: number

  @Column({ name: 'idGiocatore', type: 'int' })
  idGiocatore!: number

  @Column({ name: 'idSquadraSerieA', type: 'int', nullable: true })
  idSquadraSerieA!: number | null

  @Column({ name: 'dataAcquisto', type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
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

  @Column({
    name: 'nomeSquadraSerieA',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  nomeSquadraSerieA!: string | null

  @Column({ name: 'nomeSquadra', type: 'varchar', length: 50, nullable: true })
  nomeSquadra!: string | null

  @Column({
    name: 'media',
    type: 'decimal',
    precision: 9,
    scale: 2,
    nullable: true,
  })
  media!: string | null

  @Column({ name: 'gol', type: 'smallint', nullable: true })
  gol!: number | null

  @Column({ name: 'assist', type: 'smallint', nullable: true })
  assist!: number | null

  @Column({ name: 'giocate', type: 'smallint', nullable: true })
  giocate!: number | null

  @ManyToOne(() => Giocatori, (g: Giocatori) => g.Trasferimenti, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idGiocatore',
    foreignKeyConstraintName: 'FK_Trasferimenti_Giocatori',
  })
  Giocatori!: Relation<Giocatori>

  @ManyToOne(() => SquadreSerieA, (s: SquadreSerieA) => s.Trasferimenti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({
    name: 'idSquadraSerieA',
    foreignKeyConstraintName: 'FK_Trasferimenti_SquadreSerieA',
  })
  SquadreSerieA?: Relation<SquadreSerieA | null>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Trasferimenti, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({
    name: 'idSquadra',
    foreignKeyConstraintName: 'FK_Trasferimenti_Utenti',
  })
  Utenti?: Relation<Utenti | null>
}
