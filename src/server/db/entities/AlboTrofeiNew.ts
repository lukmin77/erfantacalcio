import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_AlboTrofei_new", ["id"], { unique: true })
@Entity("AlboTrofei_new", { schema: "public" })
export class AlboTrofeiNew {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "stagione", length: 9 })
  stagione!: string;

  @Column("character varying", { name: "campionato", length: 50 })
  campionato!: string;

  @Column("character varying", { name: "champions", length: 50 })
  champions!: string;

  @Column("character varying", { name: "secondo", length: 50 })
  secondo!: string;

  @Column("character varying", { name: "terzo", length: 50 })
  terzo!: string;
}
