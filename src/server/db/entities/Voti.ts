import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index, type Relation, JoinColumn, BaseEntity } from 'typeorm'
import { Formazioni } from './Formazioni'
import { Calendario } from './Calendario'
import { Giocatori } from './Giocatori'

@Entity({ name: 'Voti' })
@Unique('UQ_Voti_Calendario_Giocatore', ['idCalendario', 'idGiocatore'])
@Index('IX_Voti_StatsGiocatori', ['voto'])
@Index('IX_Voti_StatsGiocatori2', ['idGiocatore'])
export class Voti extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idVoto' })
  idVoto!: number

  @Column({ name: 'idGiocatore', type: 'int' })
  idGiocatore!: number

  @Column({ name: 'idCalendario', type: 'int' })
  idCalendario!: number

  @Column({ name: 'idFormazione', type: 'int', nullable: true })
  idFormazione!: number | null

  @Column({
    name: 'voto',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  voto!: number | null

  @Column({
    name: 'ammonizione',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
  })
  ammonizione!: number

  @Column({
    name: 'espulsione',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
  })
  espulsione!: number

  @Column({
    name: 'gol',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
    nullable: true,
  })
  gol!: number | null

  @Column({
    name: 'assist',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
    nullable: true,
  })
  assist!: number | null

  @Column({
    name: 'autogol',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
    nullable: true,
  })
  autogol!: number | null

  @Column({
    name: 'altriBonus',
    type: 'decimal',
    precision: 5,
    scale: 1,
    default: 0,
    nullable: true,
  })
  altriBonus!: number | null

  @Column({ name: 'titolare', type: 'boolean', default: false })
  titolare!: boolean

  @Column({ name: 'riserva', type: 'smallint', nullable: true })
  riserva!: number | null

  @ManyToOne(() => Formazioni, (f: Formazioni) => f.Voti, {
    nullable: true,
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idFormazione',
    foreignKeyConstraintName: 'FK_Formazione_Giocatori',
  })
  Formazioni?: Relation<Formazioni | null>

  @ManyToOne(() => Calendario, (c: Calendario) => c.Voti, {
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'idCalendario',
    foreignKeyConstraintName: 'FK_Voti_Calendario',
  })
  Calendario!: Relation<Calendario>

  @ManyToOne(() => Giocatori, (g: Giocatori) => g.Voti, {
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'idGiocatore',
    foreignKeyConstraintName: 'FK_Voti_Giocatori',
  })
  Giocatori!: Relation<Giocatori>
}
