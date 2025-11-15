import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Calendario } from "./Calendario.js";
import { Classifiche } from "./Classifiche.js";

@Index("IX_Tornei_idTorneo", ["idTorneo"], { unique: true })
@Index("PK_Tornei", ["idTorneo"], { unique: true })
@Entity("Tornei", { schema: "public" })
export class Tornei {
  @PrimaryGeneratedColumn({ type: "integer", name: "idTorneo" })
  idTorneo!: number;

  @Column("character varying", { name: "nome", length: 50 })
  nome!: string;

  @Column("character varying", {
    name: "gruppoFase",
    nullable: true,
    length: 50,
  })
  gruppoFase?: string | null;

  @Column("boolean", { name: "hasClassifica" })
  hasClassifica!: boolean;

  @OneToMany(() => Calendario, (calendario) => calendario.idTorneo)
  calendarios!: Calendario[];

  @OneToMany(() => Classifiche, (classifiche) => classifiche.idTorneo)
  classifiches!: Classifiche[];
}
