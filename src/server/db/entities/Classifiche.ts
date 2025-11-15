import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation } from 'typeorm'
import * as TorneiEntity from './Tornei.js'
import * as UtentiEntity from './Utenti.js'

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

  @ManyToOne(() => TorneiEntity.Tornei, (t: TorneiEntity.Tornei) => t.Classifiche)
  Tornei!: Relation<TorneiEntity.Tornei>

  @ManyToOne(() => UtentiEntity.Utenti, (u: UtentiEntity.Utenti) => u.Classifiche)
  Utenti!: Relation<UtentiEntity.Utenti>
}
