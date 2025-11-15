import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index, type Relation } from 'typeorm'
import * as FormazioniEntity from './Formazioni.js'
import * as CalendarioEntity from './Calendario.js'
import * as GiocatoriEntity from './Giocatori.js'

@Entity({ name: 'Voti' })
@Unique('UQ_Voti_Calendario_Giocatore', ['idCalendario', 'idGiocatore'])
@Index('IX_Voti_StatsGiocatori', ['voto'])
@Index('IX_Voti_StatsGiocatori2', ['idGiocatore'])
export class Voti {
  @PrimaryGeneratedColumn({ name: 'idVoto' })
  idVoto!: number

  @Column({ name: 'idGiocatore', type: 'int' })
  idGiocatore!: number

  @Column({ name: 'idCalendario', type: 'int' })
  idCalendario!: number

  @Column({ name: 'idFormazione', type: 'int', nullable: true })
  idFormazione!: number | null

  @Column({ name: 'voto', type: 'decimal', precision: 5, scale: 2, nullable: true })
  voto!: string | null

  @Column({ name: 'ammonizione', type: 'decimal', precision: 5, scale: 1, default: 0 })
  ammonizione!: string

  @Column({ name: 'espulsione', type: 'decimal', precision: 5, scale: 1, default: 0 })
  espulsione!: string

  @Column({ name: 'gol', type: 'decimal', precision: 5, scale: 1, default: 0, nullable: true })
  gol!: string | null

  @Column({ name: 'assist', type: 'decimal', precision: 5, scale: 1, default: 0, nullable: true })
  assist!: string | null

  @Column({ name: 'autogol', type: 'decimal', precision: 5, scale: 1, default: 0, nullable: true })
  autogol!: string | null

  @Column({ name: 'altriBonus', type: 'decimal', precision: 5, scale: 1, default: 0, nullable: true })
  altriBonus!: string | null

  @Column({ name: 'titolare', type: 'boolean', default: false })
  titolare!: boolean

  @Column({ name: 'riserva', type: 'smallint', nullable: true })
  riserva!: number | null

  @ManyToOne(() => FormazioniEntity.Formazioni, (f: FormazioniEntity.Formazioni) => f.Voti, { nullable: true })
  Formazioni!: Relation<FormazioniEntity.Formazioni | null>

  @ManyToOne(() => CalendarioEntity.Calendario, (c: CalendarioEntity.Calendario) => c.Voti)
  Calendario!: Relation<CalendarioEntity.Calendario>

  @ManyToOne(() => GiocatoriEntity.Giocatori, (g: GiocatoriEntity.Giocatori) => g.Voti)
  Giocatori!: Relation<GiocatoriEntity.Giocatori>
}
