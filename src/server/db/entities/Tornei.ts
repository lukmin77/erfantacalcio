import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Calendario } from './Calendario'
import { Classifiche } from './Classifiche'

@Entity({ name: 'Tornei' })
export class Tornei {
  @PrimaryGeneratedColumn({ name: 'idTorneo' })
  idTorneo!: number

  @Column({ name: 'nome', type: 'varchar', length: 50 })
  nome!: string

  @Column({ name: 'gruppoFase', type: 'varchar', length: 50, nullable: true })
  gruppoFase!: string | null

  @Column({ name: 'hasClassifica', type: 'boolean' })
  hasClassifica!: boolean

  @OneToMany(() => Calendario, (c: Calendario) => c.Tornei)
  Calendario!: Calendario[]

  @OneToMany(() => Classifiche, (c: Classifiche) => c.Tornei)
  Classifiche!: Classifiche[]
}
