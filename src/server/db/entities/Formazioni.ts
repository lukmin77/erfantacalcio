import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique, type Relation } from 'typeorm'
import { Partite } from './Partite'
import { Utenti } from './Utenti'
import { Voti } from './Voti'

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

  @ManyToOne(() => Partite, (p: Partite) => p.Formazioni)
  Partite!: Relation<Partite>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Formazioni)
  Utenti!: Relation<Utenti>

  @OneToMany(() => Voti, (v: Voti) => v.Formazioni)
  Voti!: Relation<Voti[]>
}
