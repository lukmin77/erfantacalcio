import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Calendario } from "./Calendario.js";
import { Formazioni } from "./Formazioni.js";
import { Giocatori } from "./Giocatori.js";

@Index("UQ_Voti_Calendario_Giocatore", ["idCalendario", "idGiocatore"], {
  unique: true,
})
@Index("IX_Voti_StatsGiocatori2", ["idGiocatore"], {})
@Index("IX_Voti_idVoto", ["idVoto"], { unique: true })
@Index("PK_Voti", ["idVoto"], { unique: true })
@Index("IX_Voti_StatsGiocatori", ["voto"], {})
@Entity("Voti", { schema: "public" })
export class Voti {
  @PrimaryGeneratedColumn({ type: "integer", name: "idVoto" })
  idVoto!: number;

  @Column("integer", { name: "idGiocatore", unique: true })
  idGiocatore!: number;

  @Column("integer", { name: "idCalendario", unique: true })
  idCalendario!: number;

  @Column("numeric", { name: "voto", nullable: true, precision: 5, scale: 2 })
  voto?: string | null;

  @Column("numeric", {
    name: "ammonizione",
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  ammonizione!: string;

  @Column("numeric", {
    name: "espulsione",
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  espulsione!: string;

  @Column("numeric", {
    name: "gol",
    nullable: true,
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  gol?: string | null;

  @Column("numeric", {
    name: "assist",
    nullable: true,
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  assist?: string | null;

  @Column("numeric", {
    name: "autogol",
    nullable: true,
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  autogol?: string | null;

  @Column("numeric", {
    name: "altriBonus",
    nullable: true,
    precision: 5,
    scale: 1,
    default: () => "0",
  })
  altriBonus?: string | null;

  @Column("boolean", { name: "titolare", default: () => "false" })
  titolare!: boolean;

  @Column("smallint", { name: "riserva", nullable: true })
  riserva?: number | null;

  @ManyToOne(() => Calendario, (calendario) => calendario.votis, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idCalendario", referencedColumnName: "idCalendario" }])
  idCalendario2!: Calendario;

  @ManyToOne(() => Formazioni, (formazioni) => formazioni.votis)
  @JoinColumn([{ name: "idFormazione", referencedColumnName: "idFormazione" }])
  idFormazione!: Formazioni;

  @ManyToOne(() => Giocatori, (giocatori) => giocatori.votis, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idGiocatore", referencedColumnName: "idGiocatore" }])
  idGiocatore2!: Giocatori;
}
