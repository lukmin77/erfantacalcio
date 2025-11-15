import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_AlboTrofei", ["id"], { unique: true })
@Entity("AlboTrofei", { schema: "public" })
export class AlboTrofei {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "stagione", length: 9 })
  stagione!: string;

  @Column("character varying", { name: "nomeSquadra", length: 50 })
  nomeSquadra!: string;

  @Column("boolean", {
    name: "campionato",
    nullable: true,
    default: () => "false",
  })
  campionato?: boolean | null;

  @Column("boolean", {
    name: "champions",
    nullable: true,
    default: () => "false",
  })
  champions?: boolean | null;

  @Column("boolean", {
    name: "secondo",
    nullable: true,
    default: () => "false",
  })
  secondo?: boolean | null;

  @Column("boolean", { name: "terzo", nullable: true, default: () => "false" })
  terzo?: boolean | null;

  @Column("character varying", { name: "presidente", length: 50 })
  presidente!: string;
}
