import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Classifiche } from "./Classifiche.js";
import { Formazioni } from "./Formazioni.js";
import { Partite } from "./Partite.js";
import { Trasferimenti } from "./Trasferimenti.js";

@Index("IX_Utenti_idUtente", ["idUtente"], { unique: true })
@Index("PK_Utenti", ["idUtente"], { unique: true })
@Index("IX_Utenti", ["pwd", "username"], { unique: true })
@Entity("Utenti", { schema: "public" })
export class Utenti {
  @PrimaryGeneratedColumn({ type: "integer", name: "idUtente" })
  idUtente!: number;

  @Column("character varying", { name: "username", length: 50 })
  username!: string;

  @Column("character varying", { name: "pwd", length: 50 })
  pwd!: string;

  @Column("boolean", { name: "adminLevel", default: () => "false" })
  adminLevel!: boolean;

  @Column("character varying", { name: "presidente", length: 50 })
  presidente!: string;

  @Column("character varying", { name: "mail", length: 50 })
  mail!: string;

  @Column("character varying", { name: "nomeSquadra", length: 50 })
  nomeSquadra!: string;

  @Column("character varying", { name: "foto", nullable: true, length: 500 })
  foto?: string | null;

  @Column("numeric", {
    name: "importoBase",
    precision: 9,
    scale: 2,
    default: () => "100",
  })
  importoBase!: string;

  @Column("numeric", {
    name: "importoMulte",
    precision: 9,
    scale: 2,
    default: () => "0",
  })
  importoMulte!: string;

  @Column("numeric", {
    name: "importoMercato",
    precision: 9,
    scale: 2,
    default: () => "0",
  })
  importoMercato!: string;

  @Column("numeric", {
    name: "fantaMilioni",
    precision: 9,
    scale: 2,
    default: () => "600",
  })
  fantaMilioni!: string;

  @Column("smallint", { name: "Campionato", default: () => "0" })
  campionato!: number;

  @Column("smallint", { name: "Champions", default: () => "0" })
  champions!: number;

  @Column("smallint", { name: "Secondo", default: () => "0" })
  secondo!: number;

  @Column("smallint", { name: "Terzo", default: () => "0" })
  terzo!: number;

  @Column("boolean", { name: "lockLevel", default: () => "false" })
  lockLevel!: boolean;

  @Column("character varying", { name: "maglia", nullable: true, length: 500 })
  maglia?: string | null;

  @OneToMany(() => Classifiche, (classifiche) => classifiche.idSquadra)
  classifiches!: Classifiche[];

  @OneToMany(() => Formazioni, (formazioni) => formazioni.idSquadra2)
  formazionis!: Formazioni[];

  @OneToMany(() => Partite, (partite) => partite.idSquadraA)
  partites!: Partite[];

  @OneToMany(() => Partite, (partite) => partite.idSquadraH)
  partites2!: Partite[];

  @OneToMany(() => Trasferimenti, (trasferimenti) => trasferimenti.idSquadra)
  trasferimentis!: Trasferimenti[];
}
