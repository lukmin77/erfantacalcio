import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  type Relation,
  JoinColumn,
} from 'typeorm'
import { Tornei } from './Tornei.js'
import { Partite } from './Partite.js'
import { Voti } from './Voti.js'

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

  @Column({ name: 'data', type: 'timestamptz', default: () => "CURRENT_TIMESTAMP", nullable: true })
  data!: Date | null

  @Column({ name: 'girone', type: 'smallint', nullable: true })
  girone!: number | null

  @Column({ name: 'dataFine', type: 'timestamptz', nullable: true })
  dataFine!: Date | null

  @ManyToOne(() => Tornei, (t: Tornei) => t.Calendario, {
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'idTorneo',
    foreignKeyConstraintName: 'FK_Calendario_Tornei',
  })
  Tornei!: Relation<Tornei>

  @OneToMany(() => Partite, (p: Partite) => p.Calendario)
  Partite!: Relation<Partite[]>

  @OneToMany(() => Voti, (v: Voti) => v.Calendario)
  Voti!: Relation<Voti[]>
}
