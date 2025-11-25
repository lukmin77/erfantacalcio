import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation, BaseEntity } from 'typeorm'
import { Trasferimenti } from './Trasferimenti'

@Entity({ name: 'SquadreSerieA' })
export class SquadreSerieA extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idSquadraSerieA' })
  idSquadraSerieA!: number

  @Column({ name: 'nome', type: 'varchar', length: 50 })
  nome!: string

  @Column({ name: 'maglia', type: 'varchar', length: 50 })
  maglia!: string

  @OneToMany(() => Trasferimenti, (t: Trasferimenti) => t.SquadraSerieA)
  Trasferimenti!: Relation<Trasferimenti[]>
}
