import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm'
import * as TrasferimentiEntity from './Trasferimenti.js'
import * as VotiEntity from './Voti.js'

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

  @OneToMany(() => TrasferimentiEntity.Trasferimenti, (t: TrasferimentiEntity.Trasferimenti) => t.Giocatori)
  Trasferimenti!: Relation<TrasferimentiEntity.Trasferimenti[]>

  @OneToMany(() => VotiEntity.Voti, (v: VotiEntity.Voti) => v.Giocatori)
  Voti!: Relation<VotiEntity.Voti[]>
}
