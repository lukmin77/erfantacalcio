import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("SerieA", { schema: "public" })
export class SerieA {
  @PrimaryGeneratedColumn({ type: "integer", name: "idSerieA" })
  idSerieA!: number;

  @Column("smallint", { name: "giornata" })
  giornata!: number;

  @Column("character varying", { name: "squadraHome", length: 50 })
  squadraHome!: string;

  @Column("character varying", { name: "squadraAway", length: 50 })
  squadraAway!: string;
}
