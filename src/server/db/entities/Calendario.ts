import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tornei } from "./Tornei.js";
import { Partite } from "./Partite.js";
import { Voti } from "./Voti.js";

@Index("IX_Calendario_idCalendario", ["idCalendario"], { unique: true })
@Index("PK_Calendario", ["idCalendario"], { unique: true })
@Entity("Calendario", { schema: "public" })
export class Calendario {
  @PrimaryGeneratedColumn({ type: "integer", name: "idCalendario" })
  idCalendario!: number;

  @Column("smallint", { name: "giornata" })
  giornata!: number;

  @Column("smallint", { name: "giornataSerieA" })
  giornataSerieA!: number;

  @Column("smallint", { name: "ordine" })
  ordine!: number;

  @Column("boolean", { name: "hasSovrapposta", default: () => "false" })
  hasSovrapposta!: boolean;

  @Column("boolean", { name: "hasGiocata", default: () => "false" })
  hasGiocata!: boolean;

  @Column("boolean", { name: "hasDaRecuperare", default: () => "false" })
  hasDaRecuperare!: boolean;

  @Column("timestamp with time zone", {
    name: "data",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  data?: Date | null;

  @Column("smallint", { name: "girone", nullable: true })
  girone?: number | null;

  @Column("timestamp with time zone", { name: "dataFine", nullable: true })
  dataFine?: Date | null;

  @ManyToOne(() => Tornei, (tornei) => tornei.calendarios, {
    onDelete: "RESTRICT",
  })
  @JoinColumn([{ name: "idTorneo", referencedColumnName: "idTorneo" }])
  idTorneo!: Tornei;

  @OneToMany(() => Partite, (partite) => partite.idCalendario)
  partites!: Partite[];

  @OneToMany(() => Voti, (voti) => voti.idCalendario2)
  votis!: Voti[];
}
