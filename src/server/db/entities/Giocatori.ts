import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm'
import * as VotiEntity from './Voti.js'
import { Trasferimenti } from './Trasferimenti.js'

@Entity({ name: 'Giocatori' })
export class Giocatori {
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

  @OneToMany(() => Trasferimenti, (t: Trasferimenti) => t.Giocatori)
  Trasferimenti!: Relation<Trasferimenti[]>

  @OneToMany(() => VotiEntity.Voti, (v: VotiEntity.Voti) => v.Giocatori)
  Voti!: Relation<VotiEntity.Voti[]>
}
