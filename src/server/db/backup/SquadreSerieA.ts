import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm'
import { Trasferimenti } from './Trasferimenti.js'

@Entity({ name: 'SquadreSerieA' })
export class SquadreSerieA {
  @PrimaryGeneratedColumn({ name: 'idSquadraSerieA' })
  idSquadraSerieA!: number

  @Column({ name: 'nome', type: 'varchar', length: 50 })
  nome!: string

  @Column({ name: 'maglia', type: 'varchar', length: 50 })
  maglia!: string

  @OneToMany(() => Trasferimenti, (t: Trasferimenti) => t.SquadreSerieA)
  Trasferimenti!: Relation<Trasferimenti[]>
}
