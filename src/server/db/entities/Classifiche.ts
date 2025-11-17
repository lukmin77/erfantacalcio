import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
  JoinColumn,
} from 'typeorm'
import { Tornei } from './Tornei.js'
import { Utenti } from './Utenti.js'

@Entity({ name: 'Classifiche' })
export class Classifiche {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number

  @Column({ name: 'idSquadra', type: 'int' })
  idSquadra!: number

  @Column({ name: 'idTorneo', type: 'int' })
  idTorneo!: number

  @Column({ name: 'punti', type: 'smallint' })
  punti!: number

  @Column({ name: 'vinteCasa', type: 'smallint' })
  vinteCasa!: number

  @Column({ name: 'pareggiCasa', type: 'smallint' })
  pareggiCasa!: number

  @Column({ name: 'perseCasa', type: 'smallint' })
  perseCasa!: number

  @Column({ name: 'vinteTrasferta', type: 'smallint' })
  vinteTrasferta!: number

  @Column({ name: 'pareggiTrasferta', type: 'smallint' })
  pareggiTrasferta!: number

  @Column({ name: 'perseTrasferta', type: 'smallint' })
  perseTrasferta!: number

  @Column({ name: 'golFatti', type: 'smallint' })
  golFatti!: number

  @Column({ name: 'golSubiti', type: 'smallint' })
  golSubiti!: number

  @Column({ name: 'differenzaReti', type: 'int' })
  differenzaReti!: number

  @Column({ name: 'giocate', type: 'smallint' })
  giocate!: number

  @ManyToOne(() => Tornei, (t: Tornei) => t.Classifiche, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idTorneo',
    foreignKeyConstraintName: 'FK_Classifiche_Tornei',
  })
  Tornei!: Relation<Tornei>

  @ManyToOne(() => Utenti, (u: Utenti) => u.Classifiche, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idUtente',
    foreignKeyConstraintName: 'FK_Classifiche_Utenti',
  })
  Utenti!: Relation<Utenti>
}
