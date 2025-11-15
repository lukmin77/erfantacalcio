import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Utenti } from "./Utenti.js";
import { Tornei } from "./Tornei.js";

@Index("PK_Classifiche", ["id"], { unique: true })
@Entity("Classifiche", { schema: "public" })
export class Classifiche {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("smallint", { name: "punti" })
  punti!: number;

  @Column("smallint", { name: "vinteCasa" })
  vinteCasa!: number;

  @Column("smallint", { name: "pareggiCasa" })
  pareggiCasa!: number;

  @Column("smallint", { name: "perseCasa" })
  perseCasa!: number;

  @Column("smallint", { name: "vinteTrasferta" })
  vinteTrasferta!: number;

  @Column("smallint", { name: "pareggiTrasferta" })
  pareggiTrasferta!: number;

  @Column("smallint", { name: "perseTrasferta" })
  perseTrasferta!: number;

  @Column("smallint", { name: "golFatti" })
  golFatti!: number;

  @Column("smallint", { name: "golSubiti" })
  golSubiti!: number;

  @Column("integer", { name: "differenzaReti" })
  differenzaReti!: number;

  @Column("smallint", { name: "giocate" })
  giocate!: number;

  @ManyToOne(() => Utenti, (utenti) => utenti.classifiches, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idSquadra", referencedColumnName: "idUtente" }])
  idSquadra!: Utenti;

  @ManyToOne(() => Tornei, (tornei) => tornei.classifiches, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idTorneo", referencedColumnName: "idTorneo" }])
  idTorneo!: Tornei;
}
