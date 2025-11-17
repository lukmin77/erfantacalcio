import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  type Relation,
  JoinColumn,
  BaseEntity,
} from 'typeorm'
import { Partite } from './Partite.js'
import { Utenti } from './Utenti.js'
import { Voti } from './Voti.js'

@Entity({ name: 'Formazioni' })
@Unique('UNIQUE_Formazioni_ids', ['idSquadra', 'idPartita'])
export class Formazioni extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idFormazione' })
  idFormazione!: number

  @Column({ name: 'idSquadra', type: 'int' })
  idSquadra!: number

  @Column({ name: 'idPartita', type: 'int' })
  idPartita!: number

  @Column({ name: 'dataOra', type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
  dataOra!: Date

  @Column({ name: 'modulo', type: 'varchar', length: 5 })
  modulo!: string

  @Column({ name: 'hasBloccata', type: 'boolean', default: false })
  hasBloccata!: boolean

  @ManyToOne(() => Partite, (p: Partite) => p.Formazioni, {
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'idPartita',
    foreignKeyConstraintName: 'FK_Formazioni_Partite',
  })
  Partite!: Relation<Partite>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Formazioni, {
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'idSquadra',
    foreignKeyConstraintName: 'FK_Formazioni_Utenti',
  })
  Utenti!: Relation<Utenti>

  @OneToMany(() => Voti, (v: Voti) => v.Formazioni)
  Voti!: Relation<Voti[]>
}
