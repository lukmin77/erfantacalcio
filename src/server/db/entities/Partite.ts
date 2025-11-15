import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Formazioni } from "./Formazioni.js";
import { Calendario } from "./Calendario.js";
import { Utenti } from "./Utenti.js";

@Index("PK_Partita", ["idPartita"], { unique: true })
@Index("IX_Partite_idPartita", ["idPartita"], { unique: true })
@Entity("Partite", { schema: "public" })
export class Partite {
  @PrimaryGeneratedColumn({ type: "integer", name: "idPartita" })
  idPartita!: number;

  @Column("smallint", { name: "puntiH", nullable: true })
  puntiH?: number | null;

  @Column("smallint", { name: "puntiA", nullable: true })
  puntiA?: number | null;

  @Column("smallint", { name: "golH", nullable: true })
  golH?: number | null;

  @Column("smallint", { name: "golA", nullable: true })
  golA?: number | null;

  @Column("boolean", { name: "hasMultaH", default: () => "false" })
  hasMultaH!: boolean;

  @Column("boolean", { name: "hasMultaA", default: () => "false" })
  hasMultaA!: boolean;

  @Column("numeric", {
    name: "punteggioH",
    nullable: true,
    precision: 9,
    scale: 2,
  })
  punteggioH?: string | null;

  @Column("numeric", {
    name: "punteggioA",
    nullable: true,
    precision: 9,
    scale: 2,
  })
  punteggioA?: string | null;

  @Column("boolean", { name: "fattoreCasalingo", default: () => "false" })
  fattoreCasalingo!: boolean;

  @OneToMany(() => Formazioni, (formazioni) => formazioni.idPartita2)
  formazionis!: Formazioni[];

  @ManyToOne(() => Calendario, (calendario) => calendario.partites, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idCalendario", referencedColumnName: "idCalendario" }])
  idCalendario!: Calendario;

  @ManyToOne(() => Utenti, (utenti) => utenti.partites)
  @JoinColumn([{ name: "idSquadraA", referencedColumnName: "idUtente" }])
  idSquadraA!: Utenti;

  @ManyToOne(() => Utenti, (utenti) => utenti.partites2)
  @JoinColumn([{ name: "idSquadraH", referencedColumnName: "idUtente" }])
  idSquadraH!: Utenti;
}
