import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, type Relation } from 'typeorm'
import * as TorneiEntity from './Tornei.js'
import * as PartiteEntity from './Partite.js'
import * as VotiEntity from './Voti.js'

@Entity({ name: 'Calendario' })
export class Calendario {
  @PrimaryGeneratedColumn({ name: 'idCalendario' })
  idCalendario!: number

  @Column({ name: 'giornata', type: 'smallint' })
  giornata!: number

  @Column({ name: 'idTorneo', type: 'int' })
  idTorneo!: number

  @Column({ name: 'giornataSerieA', type: 'smallint' })
  giornataSerieA!: number

  @Column({ name: 'ordine', type: 'smallint' })
  ordine!: number

  @Column({ name: 'hasSovrapposta', type: 'boolean', default: false })
  hasSovrapposta!: boolean

  @Column({ name: 'hasGiocata', type: 'boolean', default: false })
  hasGiocata!: boolean

  @Column({ name: 'hasDaRecuperare', type: 'boolean', default: false })
  hasDaRecuperare!: boolean

  @Column({ name: 'data', type: 'timestamptz', nullable: true })
  data!: Date | null

  @Column({ name: 'girone', type: 'smallint', nullable: true })
  girone!: number | null

  @Column({ name: 'dataFine', type: 'timestamptz', nullable: true })
  dataFine!: Date | null

  @ManyToOne(() => TorneiEntity.Tornei, (t: TorneiEntity.Tornei) => t.Calendario, { onUpdate: 'NO ACTION' })
  Tornei!: Relation<TorneiEntity.Tornei>

  @OneToMany(() => PartiteEntity.Partite, (p: PartiteEntity.Partite) => p.Calendario)
  Partite!: Relation<PartiteEntity.Partite[]>

  @OneToMany(() => VotiEntity.Voti, (v: VotiEntity.Voti) => v.Calendario)
  Voti!: Relation<VotiEntity.Voti[]>
}
