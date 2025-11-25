import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
  JoinColumn,
  BaseEntity,
} from 'typeorm'
import { Torneo } from './Torneo'
import { Utente } from './Utente'

@Entity({ name: 'classifica' })
export class Classifica extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number

  @Column({ name: 'id_squadra', type: 'int' })
  idSquadra!: number

  @Column({ name: 'id_torneo', type: 'int' })
  idTorneo!: number

  @Column({ name: 'punti', type: 'smallint' })
  punti!: number

  @Column({ name: 'vinte_casa', type: 'smallint' })
  vinteCasa!: number

  @Column({ name: 'pareggi_casa', type: 'smallint' })
  pareggiCasa!: number

  @Column({ name: 'perse_casa', type: 'smallint' })
  perseCasa!: number

  @Column({ name: 'vinte_trasferta', type: 'smallint' })
  vinteTrasferta!: number

  @Column({ name: 'pareggi_trasferta', type: 'smallint' })
  pareggiTrasferta!: number

  @Column({ name: 'perse_trasferta', type: 'smallint' })
  perseTrasferta!: number

  @Column({ name: 'gol_fatti', type: 'smallint' })
  golFatti!: number

  @Column({ name: 'gol_subiti', type: 'smallint' })
  golSubiti!: number

  @Column({ name: 'differenza_reti', type: 'int' })
  differenzaReti!: number

  @Column({ name: 'giocate', type: 'smallint' })
  giocate!: number

  @ManyToOne(() => Torneo, (t: Torneo) => t.Classifiche, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'id_torneo',
    foreignKeyConstraintName: 'FK_Classifiche_Tornei',
  })
  Torneo!: Relation<Torneo>

  @ManyToOne(() => Utente, (u: Utente) => u.Classifiche, {
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'id_squadra',
    foreignKeyConstraintName: 'FK_Classifiche_Utenti',
  })
  Utente!: Relation<Utente>
}
