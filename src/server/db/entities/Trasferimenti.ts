import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Giocatori } from "./Giocatori.js";
import { Utenti } from "./Utenti.js";
import { SquadreSerieA } from "./SquadreSerieA.js";

@Index("PK_Trasferimenti", ["idTrasferimento"], { unique: true })
@Index("IX_Trasferimenti_idTrasferimento", ["idTrasferimento"], {
  unique: true,
})
@Entity("Trasferimenti", { schema: "public" })
export class Trasferimenti {
  @PrimaryGeneratedColumn({ type: "integer", name: "idTrasferimento" })
  idTrasferimento!: number;

  @Column("timestamp with time zone", {
    name: "dataAcquisto",
    default: () => "CURRENT_TIMESTAMP",
  })
  dataAcquisto!: Date;

  @Column("timestamp with time zone", { name: "dataCessione", nullable: true })
  dataCessione?: Date | null;

  @Column("smallint", { name: "costo" })
  costo!: number;

  @Column("character varying", { name: "stagione", length: 9 })
  stagione!: string;

  @Column("boolean", { name: "hasRitirato", default: () => "false" })
  hasRitirato!: boolean;

  @Column("character varying", {
    name: "nomeSquadraSerieA",
    nullable: true,
    length: 50,
  })
  nomeSquadraSerieA?: string | null;

  @Column("character varying", {
    name: "nomeSquadra",
    nullable: true,
    length: 50,
  })
  nomeSquadra?: string | null;

  @Column("numeric", { name: "media", nullable: true, precision: 9, scale: 2 })
  media?: string | null;

  @Column("smallint", { name: "gol", nullable: true })
  gol?: number | null;

  @Column("smallint", { name: "assist", nullable: true })
  assist?: number | null;

  @Column("smallint", { name: "giocate", nullable: true })
  giocate?: number | null;

  @ManyToOne(() => Giocatori, (giocatori) => giocatori.trasferimentis, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idGiocatore", referencedColumnName: "idGiocatore" }])
  idGiocatore!: Giocatori;

  @ManyToOne(() => Utenti, (utenti) => utenti.trasferimentis)
  @JoinColumn([{ name: "idSquadra", referencedColumnName: "idUtente" }])
  idSquadra!: Utenti;

  @ManyToOne(
    () => SquadreSerieA,
    (squadreSerieA) => squadreSerieA.trasferimentis
  )
  @JoinColumn([
    { name: "idSquadraSerieA", referencedColumnName: "idSquadraSerieA" },
  ])
  idSquadraSerieA!: SquadreSerieA;
}
