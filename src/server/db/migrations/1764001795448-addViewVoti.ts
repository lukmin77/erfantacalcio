import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddViewVoti1764001795448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE OR REPLACE VIEW public."v_voti"
        AS
        SELECT DISTINCT v."idGiocatore",
            c."giornataSerieA",
            v.voto,
            v.ammonizione,
            v.espulsione,
            v.gol,
            v.assist,
            v.autogol,
            v."altriBonus",
            c.data
        FROM "Voti" v
     JOIN "Calendario" c ON v."idCalendario" = c."idCalendario"`)

    await queryRunner.query(`ALTER TABLE public."v_voti" OWNER TO "default"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW public."v_voti"`)
  }
}
