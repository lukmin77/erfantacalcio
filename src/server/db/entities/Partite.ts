import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Calendario } from './Calendario'
import { Formazioni } from './Formazioni'
import { Utenti } from './Utenti'

@Entity({ name: 'Partite' })
export class Partite {
  @PrimaryGeneratedColumn({ name: 'idPartita' })
  idPartita!: number

  @Column({ name: 'idCalendario', type: 'int' })
  idCalendario!: number

  @Column({ name: 'idSquadraH', type: 'int', nullable: true })
  idSquadraH!: number | null

  @Column({ name: 'idSquadraA', type: 'int', nullable: true })
  idSquadraA!: number | null

  @Column({ name: 'puntiH', type: 'smallint', nullable: true })
  puntiH!: number | null

  @Column({ name: 'puntiA', type: 'smallint', nullable: true })
  puntiA!: number | null

  @Column({ name: 'golH', type: 'smallint', nullable: true })
  golH!: number | null

  @Column({ name: 'golA', type: 'smallint', nullable: true })
  golA!: number | null

  @Column({ name: 'hasMultaH', type: 'boolean', default: false })
  hasMultaH!: boolean

  @Column({ name: 'hasMultaA', type: 'boolean', default: false })
  hasMultaA!: boolean

  @Column({ name: 'punteggioH', type: 'decimal', precision: 9, scale: 2, nullable: true })
  punteggioH!: string | null

  @Column({ name: 'punteggioA', type: 'decimal', precision: 9, scale: 2, nullable: true })
  punteggioA!: string | null

  @Column({ name: 'fattoreCasalingo', type: 'boolean', default: false })
  fattoreCasalingo!: boolean

  @OneToMany(() => Formazioni, (f: Formazioni) => f.Partite)
  Formazioni!: Formazioni[]

  @ManyToOne(() => Calendario, (c: Calendario) => c.Partite)
  @JoinColumn({ name: 'idCalendario' })
  Calendario!: Calendario

  @ManyToOne(() => Utenti, (u: Utenti) => u.Partite_Partite_idSquadraHToUtenti)
  @JoinColumn({ name: 'idSquadraH' })
  UtentiSquadraH!: Utenti | null

  @ManyToOne(() => Utenti, (u: Utenti) => u.Partite_Partite_idSquadraAToUtenti)
  @JoinColumn({ name: 'idSquadraA' })
  UtentiSquadraA!: Utenti | null
}
