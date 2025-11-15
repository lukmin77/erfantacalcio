import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique, type Relation } from 'typeorm'
import * as PartiteEntity from './Partite.js'
import * as UtentiEntity from './Utenti.js'
import * as VotiEntity from './Voti.js'

@Entity({ name: 'Formazioni' })
@Unique('UNIQUE_Formazioni_ids', ['idSquadra', 'idPartita'])
export class Formazioni {
  @PrimaryGeneratedColumn({ name: 'idFormazione' })
  idFormazione!: number

  @Column({ name: 'idSquadra', type: 'int' })
  idSquadra!: number

  @Column({ name: 'idPartita', type: 'int' })
  idPartita!: number

  @Column({ name: 'dataOra', type: 'timestamptz' })
  dataOra!: Date

  @Column({ name: 'modulo', type: 'varchar', length: 5 })
  modulo!: string

  @Column({ name: 'hasBloccata', type: 'boolean', default: false })
  hasBloccata!: boolean

  @ManyToOne(() => PartiteEntity.Partite, (p: PartiteEntity.Partite) => p.Formazioni)
  Partite!: Relation<PartiteEntity.Partite>

  @ManyToOne(() => UtentiEntity.Utenti, (u: UtentiEntity.Utenti) => u.Formazioni)
  Utenti!: Relation<UtentiEntity.Utenti>

  @OneToMany(() => VotiEntity.Voti, (v: VotiEntity.Voti) => v.Formazioni)
  Voti!: Relation<VotiEntity.Voti[]>
}
