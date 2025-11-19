import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, type Relation, BaseEntity } from 'typeorm'
import * as FormazioniEntity from './Formazioni'
import { Calendario } from './Calendario'
import { Utenti } from './Utenti'

@Entity({ name: 'Partite' })
export class Partite extends BaseEntity {
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
  punteggioH!: number | null

  @Column({ name: 'punteggioA', type: 'decimal', precision: 9, scale: 2, nullable: true })
  punteggioA!: number | null

  @Column({ name: 'fattoreCasalingo', type: 'boolean', default: false })
  fattoreCasalingo!: boolean

  @OneToMany(() => FormazioniEntity.Formazioni, (f: FormazioniEntity.Formazioni) => f.Partite)
  Formazioni!: Relation<FormazioniEntity.Formazioni[]>

  @ManyToOne(() => Calendario, (c: Calendario) => c.Partite, { onUpdate: 'NO ACTION', onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idCalendario', foreignKeyConstraintName: 'FK_Partite_Calendario' })
  Calendario!: Relation<Calendario>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Partite_Partite_idSquadraHToUtenti, { onUpdate: 'NO ACTION', onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'idSquadraH', foreignKeyConstraintName: 'FK_Partite_SquadreCasa' })
  UtentiSquadraH!: Relation<Utenti | null>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Partite_Partite_idSquadraAToUtenti, { onUpdate: 'NO ACTION', onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'idSquadraA', foreignKeyConstraintName: 'FK_Partite_SquadreTrasferta' })
  UtentiSquadraA!: Relation<Utenti | null>
}
