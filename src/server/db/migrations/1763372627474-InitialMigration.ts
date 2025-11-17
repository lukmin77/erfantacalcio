import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1763372627474 implements MigrationInterface {
    name = 'InitialMigration1763372627474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IX_Giocatori_idGiocatore"`);
        await queryRunner.query(`DROP INDEX "public"."UNIQUE_GIOCATORI_NOME"`);
        await queryRunner.query(`DROP INDEX "public"."IX_SquadreSerieA_idSquadraSerieA"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Trasferimenti_idTrasferimento"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Utenti"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Utenti_idUtente"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Tornei_idTorneo"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Calendario_idCalendario"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Partite_idPartita"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Formazioni_idFormazione"`);
        await queryRunner.query(`DROP INDEX "public"."UNIQUE_Formazioni_ids"`);
        await queryRunner.query(`DROP INDEX "public"."IX_Voti_idVoto"`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ADD "idUtente" integer`);
        await queryRunner.query(`ALTER TABLE "Classifiche" ADD "idUtente" integer`);
        await queryRunner.query(`ALTER TABLE "Partite" ADD "idUtente" integer`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ADD "idUtente" integer`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "SerieA_idSerieA_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "SerieA_idSerieA_seq" OWNER TO "default"`);
        await queryRunner.query(`ALTER SEQUENCE public."SerieA_idSerieA_seq" OWNED BY "SerieA"."idSerieA"`);
        await queryRunner.query(`ALTER TABLE "SerieA" ALTER COLUMN "idSerieA" SET DEFAULT nextval('"SerieA_idSerieA_seq"')`);
        await queryRunner.query(`ALTER TABLE "FlowNewSeasosn" ALTER COLUMN "data" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "FlowNewSeasosn" ALTER COLUMN "data" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Giocatori" ADD CONSTRAINT "UQ_45ace405cb62d43dbe932411207" UNIQUE ("nome")`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataAcquisto" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataAcquisto" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataCessione" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "data" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "data" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "dataFine" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ALTER COLUMN "dataOra" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ALTER COLUMN "dataOra" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "AlboTrofei_new_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "AlboTrofei_new_id_seq" OWNER TO "default"`);
        await queryRunner.query(`ALTER SEQUENCE public."AlboTrofei_new_id_seq" OWNED BY "AlboTrofei_new"."id"`);
        await queryRunner.query(`ALTER TABLE "AlboTrofei_new" ALTER COLUMN "id" SET DEFAULT nextval('"AlboTrofei_new_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "AlboTrofei_new" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ADD CONSTRAINT "UNIQUE_Formazioni_ids" UNIQUE ("idSquadra", "idPartita")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Formazioni" DROP CONSTRAINT "UNIQUE_Formazioni_ids"`);
        await queryRunner.query(`ALTER TABLE "AlboTrofei_new" ALTER COLUMN "id" SET DEFAULT nextval('"AlboTrofei_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "AlboTrofei_new" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "AlboTrofei_new_id_seq"`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ALTER COLUMN "dataOra" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Formazioni" ALTER COLUMN "dataOra" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "dataFine" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "data" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Calendario" ALTER COLUMN "data" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataCessione" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataAcquisto" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" ALTER COLUMN "dataAcquisto" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "Giocatori" DROP CONSTRAINT "UQ_45ace405cb62d43dbe932411207"`);
        await queryRunner.query(`ALTER TABLE "FlowNewSeasosn" ALTER COLUMN "data" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "FlowNewSeasosn" ALTER COLUMN "data" TYPE TIMESTAMP(3) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "SerieA" ALTER COLUMN "idSerieA" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "SerieA_idSerieA_seq"`);
        await queryRunner.query(`ALTER TABLE "Formazioni" DROP COLUMN "idUtente"`);
        await queryRunner.query(`ALTER TABLE "Partite" DROP COLUMN "idUtente"`);
        await queryRunner.query(`ALTER TABLE "Classifiche" DROP COLUMN "idUtente"`);
        await queryRunner.query(`ALTER TABLE "Trasferimenti" DROP COLUMN "idUtente"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Voti_idVoto" ON "Voti" ("idVoto") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UNIQUE_Formazioni_ids" ON "Formazioni" ("idSquadra", "idPartita") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Formazioni_idFormazione" ON "Formazioni" ("idFormazione") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Partite_idPartita" ON "Partite" ("idPartita") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Calendario_idCalendario" ON "Calendario" ("idCalendario") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Tornei_idTorneo" ON "Tornei" ("idTorneo") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Utenti_idUtente" ON "Utenti" ("idUtente") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Utenti" ON "Utenti" ("username", "pwd") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Trasferimenti_idTrasferimento" ON "Trasferimenti" ("idTrasferimento") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_SquadreSerieA_idSquadraSerieA" ON "SquadreSerieA" ("idSquadraSerieA") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UNIQUE_GIOCATORI_NOME" ON "Giocatori" ("nome") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IX_Giocatori_idGiocatore" ON "Giocatori" ("idGiocatore") `);
    }

}
