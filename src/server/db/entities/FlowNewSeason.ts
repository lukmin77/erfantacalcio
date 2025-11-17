import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_FlowNewSeason", ["id"], { unique: true })
@Index("IX_FlowSeason_id", ["id"], { unique: true })
@Entity("FlowNewSeasosn", { schema: "public" })
export class FlowNewSeasosn {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("integer", { name: "idFase" })
  idFase!: number;

  @Column("boolean", { name: "active", default: () => "false" })
  active!: boolean;

  @Column("timestamp with time zone", {
    name: "data",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  data?: Date | null;
}
