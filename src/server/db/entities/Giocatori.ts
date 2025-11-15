import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trasferimenti } from "./Trasferimenti.js";
import { Voti } from "./Voti.js";

@Index("IX_Giocatori_idGiocatore", ["idGiocatore"], { unique: true })
@Index("PK_Giocatori", ["idGiocatore"], { unique: true })
@Index("UNIQUE_GIOCATORI_NOME", ["nome"], { unique: true })
@Entity("Giocatori", { schema: "public" })
export class Giocatori {
  @PrimaryGeneratedColumn({ type: "integer", name: "idGiocatore" })
  idGiocatore!: number;

  @Column("character varying", { name: "ruolo", length: 1 })
  ruolo!: string;

  @Column("character varying", { name: "nome", length: 50 })
  nome!: string;

  @Column("character varying", {
    name: "nomeFantaGazzetta",
    nullable: true,
    length: 500,
  })
  nomeFantaGazzetta?: string | null;

  @Column("integer", { name: "id_pf", nullable: true })
  idPf?: number | null;

  @OneToMany(() => Trasferimenti, (trasferimenti) => trasferimenti.idGiocatore)
  trasferimentis!: Trasferimenti[];

  @OneToMany(() => Voti, (voti) => voti.idGiocatore2)
  votis!: Voti[];
}
