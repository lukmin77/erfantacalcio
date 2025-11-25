import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation, BaseEntity } from 'typeorm'
import { Trasferimenti } from './Trasferimenti'
import { Voti } from './Voti'

@Entity({ name: 'Giocatori' })
export class Giocatori extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idGiocatore' })
  idGiocatore!: number

  @Column({ name: 'ruolo', type: 'varchar', length: 1 })
  ruolo!: string

  @Column({ name: 'nome', type: 'varchar', length: 50, unique: true })
  nome!: string

  @Column({ name: 'nomeFantaGazzetta', type: 'varchar', length: 500, nullable: true })
  nomeFantaGazzetta!: string | null

  @Column({ name: 'id_pf', type: 'int', nullable: true })
  id_pf!: number | null

  @OneToMany(() => Trasferimenti, (t: Trasferimenti) => t.Giocatore)
  Trasferimenti!: Relation<Trasferimenti[]>

  @OneToMany(() => Voti, (v: Voti) => v.Giocatore)
  Voti!: Relation<Voti[]>
}
