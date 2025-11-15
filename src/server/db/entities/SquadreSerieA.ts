import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trasferimenti } from "./Trasferimenti.js";

@Index("PK_SquadreSerieA", ["idSquadraSerieA"], { unique: true })
@Index("IX_SquadreSerieA_idSquadraSerieA", ["idSquadraSerieA"], {
  unique: true,
})
@Entity("SquadreSerieA", { schema: "public" })
export class SquadreSerieA {
  @PrimaryGeneratedColumn({ type: "integer", name: "idSquadraSerieA" })
  idSquadraSerieA!: number;

  @Column("character varying", { name: "nome", length: 50 })
  nome!: string;

  @Column("character varying", { name: "maglia", length: 50 })
  maglia!: string;

  @OneToMany(
    () => Trasferimenti,
    (trasferimenti) => trasferimenti.idSquadraSerieA
  )
  trasferimentis!: Trasferimenti[];
}
