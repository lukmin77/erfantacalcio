import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Partite } from "./Partite.js";
import { Utenti } from "./Utenti.js";
import { Voti } from "./Voti.js";

@Index("PK_Formazioni", ["idFormazione"], { unique: true })
@Index("IX_Formazioni_idFormazione", ["idFormazione"], { unique: true })
@Index("UNIQUE_Formazioni_ids", ["idPartita", "idSquadra"], { unique: true })
@Entity("Formazioni", { schema: "public" })
export class Formazioni {
  @PrimaryGeneratedColumn({ type: "integer", name: "idFormazione" })
  idFormazione!: number;

  @Column("integer", { name: "idSquadra" })
  idSquadra!: number;

  @Column("integer", { name: "idPartita" })
  idPartita!: number;

  @Column("timestamp with time zone", {
    name: "dataOra",
    default: () => "CURRENT_TIMESTAMP",
  })
  dataOra!: Date;

  @Column("character varying", { name: "modulo", length: 5 })
  modulo!: string;

  @Column("boolean", { name: "hasBloccata", default: () => "false" })
  hasBloccata!: boolean;

  @ManyToOne(() => Partite, (partite) => partite.formazionis, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idPartita", referencedColumnName: "idPartita" }])
  idPartita2!: Partite;

  @ManyToOne(() => Utenti, (utenti) => utenti.formazionis, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idSquadra", referencedColumnName: "idUtente" }])
  idSquadra2!: Utenti;

  @OneToMany(() => Voti, (voti) => voti.idFormazione)
  votis!: Voti[];
}
