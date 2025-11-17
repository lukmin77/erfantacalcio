import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("FlowNewSeasosn", { schema: "public" })
export class FlowNewSeason extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id", primaryKeyConstraintName: "PK_FlowNewSeason" })
  id!: number;

  @Column("integer", { name: "idFase" })
  idFase!: number;

  @Column("boolean", { name: "active", default: () => "false" })
  active!: boolean;

  @Column("timestamptz", {
    name: "data",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  data?: Date | null;
}
