import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation, BaseEntity } from 'typeorm'
import { Trasferimenti } from './Trasferimenti'
import { Classifiche } from './Classifiche'
import { Formazioni } from './Formazioni'
import { Partite } from './Partite'

@Entity({ name: 'Utenti' })
export class Utenti extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'idUtente' })
  idUtente!: number

  @Column({ name: 'username', type: 'varchar', length: 50 })
  username!: string

  @Column({ name: 'pwd', type: 'varchar', length: 50 })
  pwd!: string

  @Column({ name: 'adminLevel', type: 'boolean', default: false })
  adminLevel!: boolean

  @Column({ name: 'presidente', type: 'varchar', length: 50 })
  presidente!: string

  @Column({ name: 'mail', type: 'varchar', length: 50 })
  mail!: string

  @Column({ name: 'nomeSquadra', type: 'varchar', length: 50 })
  nomeSquadra!: string

  @Column({ name: 'foto', type: 'varchar', length: 500, nullable: true })
  foto!: string | null

  @Column({ name: 'importoBase', type: 'decimal', precision: 9, scale: 2, default: 100 })
  importoBase!: number

  @Column({ name: 'importoMulte', type: 'decimal', precision: 9, scale: 2, default: 0 })
  importoMulte!: number

  @Column({ name: 'importoMercato', type: 'decimal', precision: 9, scale: 2, default: 0 })
  importoMercato!: number

  @Column({ name: 'fantaMilioni', type: 'decimal', precision: 9, scale: 2, default: 600 })
  fantaMilioni!: number

  @Column({ name: 'Campionato', type: 'smallint', default: 0 })
  Campionato!: number

  @Column({ name: 'Champions', type: 'smallint', default: 0 })
  Champions!: number

  @Column({ name: 'Secondo', type: 'smallint', default: 0 })
  Secondo!: number

  @Column({ name: 'Terzo', type: 'smallint', default: 0 })
  Terzo!: number

  @Column({ name: 'lockLevel', type: 'boolean', default: false })
  lockLevel!: boolean

  @Column({ name: 'maglia', type: 'varchar', length: 500, nullable: true })
  maglia!: string | null

  @OneToMany(() => Classifiche, (c: Classifiche) => c.Utente)
  Classifiche!: Relation<Classifiche[]>

  @OneToMany(() => Formazioni, (f: Formazioni) => f.Utente)
  Formazioni!: Relation<Formazioni[]>

  @OneToMany(() => Partite, (p: Partite) => p.SquadraHome)
  PartiteHome!: Relation<Partite[]>

  @OneToMany(() => Partite, (p: Partite) => p.SquadraAway)
  PartiteAway!: Relation<Partite[]>
  
  @OneToMany(() => Trasferimenti, (t: Trasferimenti) => t.Utente)
  Trasferimenti!: Relation<Trasferimenti[]>
}
