-- CreateTable
CREATE TABLE "AlboTrofei" (
    "id" SERIAL NOT NULL,
    "stagione" VARCHAR(9) NOT NULL,
    "nomeSquadra" VARCHAR(50) NOT NULL,
    "campionato" BOOLEAN DEFAULT false,
    "champions" BOOLEAN DEFAULT false,
    "secondo" BOOLEAN DEFAULT false,
    "terzo" BOOLEAN DEFAULT false,
    "presidente" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_AlboTrofei" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendario" (
    "idCalendario" SERIAL NOT NULL,
    "giornata" SMALLINT NOT NULL,
    "idTorneo" INTEGER NOT NULL,
    "giornataSerieA" SMALLINT NOT NULL,
    "ordine" SMALLINT NOT NULL,
    "hasSovrapposta" BOOLEAN NOT NULL DEFAULT false,
    "hasGiocata" BOOLEAN NOT NULL DEFAULT false,
    "hasDaRecuperare" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) with time zone DEFAULT CURRENT_TIMESTAMP,
    "girone" SMALLINT,
    "dataFine" TIMESTAMP(3) with time zone,

    CONSTRAINT "PK_Calendario" PRIMARY KEY ("idCalendario")
);

-- CreateTable
CREATE TABLE "Classifiche" (
    "id" SERIAL NOT NULL,
    "idSquadra" INTEGER NOT NULL,
    "idTorneo" INTEGER NOT NULL,
    "punti" SMALLINT NOT NULL,
    "vinteCasa" SMALLINT NOT NULL,
    "pareggiCasa" SMALLINT NOT NULL,
    "perseCasa" SMALLINT NOT NULL,
    "vinteTrasferta" SMALLINT NOT NULL,
    "pareggiTrasferta" SMALLINT NOT NULL,
    "perseTrasferta" SMALLINT NOT NULL,
    "golFatti" SMALLINT NOT NULL,
    "golSubiti" SMALLINT NOT NULL,
    "differenzaReti" INTEGER NOT NULL,
    "giocate" SMALLINT NOT NULL,

    CONSTRAINT "PK_Classifiche" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formazioni" (
    "idFormazione" SERIAL NOT NULL,
    "idSquadra" INTEGER NOT NULL,
    "idPartita" INTEGER NOT NULL,
    "dataOra" TIMESTAMP(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modulo" VARCHAR(5) NOT NULL,
    "hasBloccata" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_Formazioni" PRIMARY KEY ("idFormazione")
);

-- CreateTable
CREATE TABLE "Giocatori" (
    "idGiocatore" SERIAL NOT NULL,
    "ruolo" VARCHAR(1) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomeFantaGazzetta" VARCHAR(500),

    CONSTRAINT "PK_Giocatori" PRIMARY KEY ("idGiocatore")
);

-- CreateTable
CREATE TABLE "Partite" (
    "idPartita" SERIAL NOT NULL,
    "idCalendario" INTEGER NOT NULL,
    "idSquadraH" INTEGER,
    "idSquadraA" INTEGER,
    "puntiH" SMALLINT,
    "puntiA" SMALLINT,
    "golH" SMALLINT,
    "golA" SMALLINT,
    "hasMultaH" BOOLEAN NOT NULL DEFAULT false,
    "hasMultaA" BOOLEAN NOT NULL DEFAULT false,
    "punteggioH" DECIMAL(9,2),
    "punteggioA" DECIMAL(9,2),
    "fattoreCasalingo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_Partita" PRIMARY KEY ("idPartita")
);

-- CreateTable
CREATE TABLE "SquadreSerieA" (
    "idSquadraSerieA" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "maglia" VARCHAR(50) NOT NULL,

    CONSTRAINT "PK_SquadreSerieA" PRIMARY KEY ("idSquadraSerieA")
);

-- CreateTable
CREATE TABLE "StatsA" (
    "id" SERIAL NOT NULL,
    "media" DECIMAL(38,6),
    "mediabonus" DECIMAL(38,6),
    "golfatti" DECIMAL(38,6),
    "golsubiti" DECIMAL(38,1),
    "ammonizioni" DECIMAL(38,6),
    "espulsioni" DECIMAL(38,6),
    "assist" DECIMAL(38,1),
    "giocate" INTEGER,
    "ruolo" VARCHAR(1) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomefantagazzetta" VARCHAR(500),
    "idgiocatore" INTEGER NOT NULL,
    "maglia" VARCHAR(50) NOT NULL,
    "squadraSerieA" VARCHAR(50) NOT NULL,
    "squadra" VARCHAR(50),
    "idSquadra" INTEGER,

    CONSTRAINT "PK_StatsA" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsC" (
    "id" SERIAL NOT NULL,
    "media" DECIMAL(38,6),
    "mediabonus" DECIMAL(38,6),
    "golfatti" DECIMAL(38,6),
    "golsubiti" DECIMAL(38,1),
    "ammonizioni" DECIMAL(38,6),
    "espulsioni" DECIMAL(38,6),
    "assist" DECIMAL(38,1),
    "giocate" INTEGER,
    "ruolo" VARCHAR(1) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomefantagazzetta" VARCHAR(500),
    "idgiocatore" INTEGER NOT NULL,
    "maglia" VARCHAR(50) NOT NULL,
    "squadraSerieA" VARCHAR(50) NOT NULL,
    "squadra" VARCHAR(50),
    "idSquadra" INTEGER,

    CONSTRAINT "PK_StatsC" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsD" (
    "id" SERIAL NOT NULL,
    "media" DECIMAL(38,6),
    "mediabonus" DECIMAL(38,6),
    "golfatti" DECIMAL(38,6),
    "golsubiti" DECIMAL(38,1),
    "ammonizioni" DECIMAL(38,6),
    "espulsioni" DECIMAL(38,6),
    "assist" DECIMAL(38,1),
    "giocate" INTEGER,
    "ruolo" VARCHAR(1) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomefantagazzetta" VARCHAR(500),
    "idgiocatore" INTEGER NOT NULL,
    "maglia" VARCHAR(50) NOT NULL,
    "squadraSerieA" VARCHAR(50) NOT NULL,
    "squadra" VARCHAR(50),
    "idSquadra" INTEGER,

    CONSTRAINT "PK_StatsD" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsP" (
    "id" SERIAL NOT NULL,
    "media" DECIMAL(38,6),
    "mediabonus" DECIMAL(38,6),
    "golfatti" DECIMAL(38,6),
    "golsubiti" DECIMAL(38,1),
    "ammonizioni" DECIMAL(38,6),
    "espulsioni" DECIMAL(38,6),
    "assist" DECIMAL(38,1),
    "giocate" INTEGER,
    "ruolo" VARCHAR(1) NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nomefantagazzetta" VARCHAR(500),
    "idgiocatore" INTEGER NOT NULL,
    "maglia" VARCHAR(50) NOT NULL,
    "squadraSerieA" VARCHAR(50) NOT NULL,
    "squadra" VARCHAR(50),
    "idSquadra" INTEGER,

    CONSTRAINT "PK_StatsP" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tornei" (
    "idTorneo" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "gruppoFase" VARCHAR(50),
    "hasClassifica" BOOLEAN NOT NULL,

    CONSTRAINT "PK_Tornei" PRIMARY KEY ("idTorneo")
);

-- CreateTable
CREATE TABLE "Trasferimenti" (
    "idTrasferimento" SERIAL NOT NULL,
    "idGiocatore" INTEGER NOT NULL,
    "idSquadraSerieA" INTEGER,
    "dataAcquisto" TIMESTAMP(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCessione" TIMESTAMP(3) with time zone,
    "idSquadra" INTEGER,
    "costo" SMALLINT NOT NULL,
    "stagione" VARCHAR(9) NOT NULL,
    "hasRitirato" BOOLEAN NOT NULL DEFAULT false,
    "nomeSquadraSerieA" VARCHAR(50),
    "nomeSquadra" VARCHAR(50),
    "media" DECIMAL(9,2),
    "gol" SMALLINT,
    "assist" SMALLINT,
    "giocate" SMALLINT,

    CONSTRAINT "PK_Trasferimenti" PRIMARY KEY ("idTrasferimento")
);

-- CreateTable
CREATE TABLE "Utenti" (
    "idUtente" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "pwd" VARCHAR(50) NOT NULL,
    "adminLevel" BOOLEAN NOT NULL DEFAULT false,
    "presidente" VARCHAR(50) NOT NULL,
    "mail" VARCHAR(50) NOT NULL,
    "nomeSquadra" VARCHAR(50) NOT NULL,
    "foto" VARCHAR(100),
    "importoBase" DECIMAL(9,2) NOT NULL DEFAULT 100,
    "importoMulte" DECIMAL(9,2) NOT NULL DEFAULT 0,
    "importoMercato" DECIMAL(9,2) NOT NULL DEFAULT 0,
    "fantaMilioni" DECIMAL(9,2) NOT NULL DEFAULT 600,
    "Campionato" SMALLINT NOT NULL DEFAULT 0,
    "Champions" SMALLINT NOT NULL DEFAULT 0,
    "Secondo" SMALLINT NOT NULL DEFAULT 0,
    "Terzo" SMALLINT NOT NULL DEFAULT 0,
    "lockLevel" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_Utenti" PRIMARY KEY ("idUtente")
);

-- CreateTable
CREATE TABLE "Voti" (
    "idVoto" SERIAL NOT NULL,
    "idGiocatore" INTEGER NOT NULL,
    "idCalendario" INTEGER NOT NULL,
    "idFormazione" INTEGER,
    "voto" DECIMAL(5,2),
    "ammonizione" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "espulsione" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "gol" DECIMAL(5,1) DEFAULT 0,
    "assist" DECIMAL(5,1) DEFAULT 0,
    "autogol" DECIMAL(5,1) DEFAULT 0,
    "altriBonus" DECIMAL(5,1) DEFAULT 0,
    "titolare" BOOLEAN NOT NULL DEFAULT false,
    "riserva" SMALLINT,

    CONSTRAINT "PK_Voti" PRIMARY KEY ("idVoto")
);

-- CreateTable
CREATE TABLE "FlowNewSeasosn" (
    "id" SERIAL NOT NULL,
    "idFase" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) with time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_FlowNewSeason" PRIMARY KEY ("id")
);

CREATE OR REPLACE VIEW public."vVotiDistinct" AS
SELECT DISTINCT
    v."idGiocatore",
    c."giornataSerieA",
    v."voto",
    v."ammonizione",
    v."espulsione",
    v."gol",
    v."assist",
    v."autogol",
    v."altriBonus",
    c."data"
FROM
    public."Voti" v
INNER JOIN
    public."Calendario" c ON v."idCalendario" = c."idCalendario";


CREATE OR REPLACE FUNCTION public.sp_refreshstats_p(
	p_ruolo character varying,
	p_stagione character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    TRUNCATE TABLE public."StatsP";

    INSERT INTO public."StatsP" (
        media, "mediabonus", "golfatti", "golsubiti", ammonizioni, espulsioni, assist, giocate, ruolo, nome, "nomefantagazzetta", "idgiocatore", maglia, "squadraSerieA", squadra, "idSquadra"
    )
	SELECT 
        ROUND(AVG(v.voto), 2) AS media,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) AS mediabonus,
        SUM(v.gol / 3) AS golfatti,
        -SUM(v.gol) AS golsubiti,
        SUM(v.ammonizione / -0.5) AS ammonizioni,
        SUM(v.espulsione / -1) AS espulsioni,
        SUM(v.assist) AS assist,
        COUNT(v.voto) AS giocate,
        g.ruolo,
        g.nome,
        g."nomeFantaGazzetta",
        g."idGiocatore",
        s.maglia,
        s.nome AS squadraserieA,
        u."nomeSquadra" AS squadra,
        t."idSquadra" AS idsquadra
    FROM 
        public."vVotiDistinct" AS v
    INNER JOIN 
        public."Giocatori" AS g ON v."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."Trasferimenti" AS t ON t."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."SquadreSerieA" AS s ON s."idSquadraSerieA" = t."idSquadraSerieA"
    LEFT JOIN 
        public."Utenti" AS u ON u."idUtente" = t."idSquadra"
    WHERE 
        v.voto > 0
        AND ((t."dataAcquisto" < NOW() AND t."dataCessione" IS NULL) OR (t."dataCessione" IS NOT NULL AND t."dataAcquisto" < NOW() AND t."dataCessione" > NOW()))
        AND t.stagione = p_stagione
        AND g.ruolo = p_ruolo
    GROUP BY 
        g.ruolo, g.nome, g."nomeFantaGazzetta", g."idGiocatore", s.nome, u."nomeSquadra", s.maglia, t.stagione, t."nomeSquadraSerieA", t."nomeSquadra", t."idSquadra"
    ORDER BY 
        ROUND(AVG(v.voto), 2) DESC,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) DESC,
        COUNT(v.voto) DESC;
END;
$BODY$;

ALTER FUNCTION public.sp_refreshstats_p(character varying, character varying)
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.sp_refreshstats_d(
	p_ruolo character varying,
	p_stagione character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    TRUNCATE TABLE public."StatsD";

    INSERT INTO public."StatsD" (
        media, "mediabonus", "golfatti", "golsubiti", ammonizioni, espulsioni, assist, giocate, ruolo, nome, "nomefantagazzetta", "idgiocatore", maglia, "squadraSerieA", squadra, "idSquadra"
    )
	SELECT 
        ROUND(AVG(v.voto), 2) AS media,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) AS mediabonus,
        SUM(v.gol / 3) AS golfatti,
        -SUM(v.gol) AS golsubiti,
        SUM(v.ammonizione / -0.5) AS ammonizioni,
        SUM(v.espulsione / -1) AS espulsioni,
        SUM(v.assist) AS assist,
        COUNT(v.voto) AS giocate,
        g.ruolo,
        g.nome,
        g."nomeFantaGazzetta",
        g."idGiocatore",
        s.maglia,
        s.nome AS squadraserieA,
        u."nomeSquadra" AS squadra,
        t."idSquadra" AS idsquadra
    FROM 
        public."vVotiDistinct" AS v
    INNER JOIN 
        public."Giocatori" AS g ON v."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."Trasferimenti" AS t ON t."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."SquadreSerieA" AS s ON s."idSquadraSerieA" = t."idSquadraSerieA"
    LEFT JOIN 
        public."Utenti" AS u ON u."idUtente" = t."idSquadra"
    WHERE 
        v.voto > 0
        AND ((t."dataAcquisto" < NOW() AND t."dataCessione" IS NULL) OR (t."dataCessione" IS NOT NULL AND t."dataAcquisto" < NOW() AND t."dataCessione" > NOW()))
        AND t.stagione = p_stagione
        AND g.ruolo = p_ruolo
    GROUP BY 
        g.ruolo, g.nome, g."nomeFantaGazzetta", g."idGiocatore", s.nome, u."nomeSquadra", s.maglia, t.stagione, t."nomeSquadraSerieA", t."nomeSquadra", t."idSquadra"
    ORDER BY 
        ROUND(AVG(v.voto), 2) DESC,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) DESC,
        COUNT(v.voto) DESC;
END;
$BODY$;

ALTER FUNCTION public.sp_refreshstats_d(character varying, character varying)
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.sp_refreshstats_c(
	p_ruolo character varying,
	p_stagione character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    TRUNCATE TABLE public."StatsC";

    INSERT INTO public."StatsC" (
        media, "mediabonus", "golfatti", "golsubiti", ammonizioni, espulsioni, assist, giocate, ruolo, nome, "nomefantagazzetta", "idgiocatore", maglia, "squadraSerieA", squadra, "idSquadra"
    )
	SELECT 
        ROUND(AVG(v.voto), 2) AS media,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) AS mediabonus,
        SUM(v.gol / 3) AS golfatti,
        -SUM(v.gol) AS golsubiti,
        SUM(v.ammonizione / -0.5) AS ammonizioni,
        SUM(v.espulsione / -1) AS espulsioni,
        SUM(v.assist) AS assist,
        COUNT(v.voto) AS giocate,
        g.ruolo,
        g.nome,
        g."nomeFantaGazzetta",
        g."idGiocatore",
        s.maglia,
        s.nome AS squadraserieA,
        u."nomeSquadra" AS squadra,
        t."idSquadra" AS idsquadra
    FROM 
        public."vVotiDistinct" AS v
    INNER JOIN 
        public."Giocatori" AS g ON v."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."Trasferimenti" AS t ON t."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."SquadreSerieA" AS s ON s."idSquadraSerieA" = t."idSquadraSerieA"
    LEFT JOIN 
        public."Utenti" AS u ON u."idUtente" = t."idSquadra"
    WHERE 
        v.voto > 0
        AND ((t."dataAcquisto" < NOW() AND t."dataCessione" IS NULL) OR (t."dataCessione" IS NOT NULL AND t."dataAcquisto" < NOW() AND t."dataCessione" > NOW()))
        AND t.stagione = p_stagione
        AND g.ruolo = p_ruolo
    GROUP BY 
        g.ruolo, g.nome, g."nomeFantaGazzetta", g."idGiocatore", s.nome, u."nomeSquadra", s.maglia, t.stagione, t."nomeSquadraSerieA", t."nomeSquadra", t."idSquadra"
    ORDER BY 
        ROUND(AVG(v.voto), 2) DESC,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) DESC,
        COUNT(v.voto) DESC;
END;
$BODY$;

ALTER FUNCTION public.sp_refreshstats_c(character varying, character varying)
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.sp_refreshstats_a(
	p_ruolo character varying,
	p_stagione character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    TRUNCATE TABLE public."StatsA";

    INSERT INTO public."StatsA" (
        media, "mediabonus", "golfatti", "golsubiti", ammonizioni, espulsioni, assist, giocate, ruolo, nome, "nomefantagazzetta", "idgiocatore", maglia, "squadraSerieA", squadra, "idSquadra"
    )
	SELECT 
        ROUND(AVG(v.voto), 2) AS media,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) AS mediabonus,
        SUM(v.gol / 3) AS golfatti,
        -SUM(v.gol) AS golsubiti,
        SUM(v.ammonizione / -0.5) AS ammonizioni,
        SUM(v.espulsione / -1) AS espulsioni,
        SUM(v.assist) AS assist,
        COUNT(v.voto) AS giocate,
        g.ruolo,
        g.nome,
        g."nomeFantaGazzetta",
        g."idGiocatore",
        s.maglia,
        s.nome AS squadraserieA,
        u."nomeSquadra" AS squadra,
        t."idSquadra" AS idsquadra
    FROM 
        public."vVotiDistinct" AS v
    INNER JOIN 
        public."Giocatori" AS g ON v."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."Trasferimenti" AS t ON t."idGiocatore" = g."idGiocatore"
    INNER JOIN 
        public."SquadreSerieA" AS s ON s."idSquadraSerieA" = t."idSquadraSerieA"
    LEFT JOIN 
        public."Utenti" AS u ON u."idUtente" = t."idSquadra"
    WHERE 
        v.voto > 0
        AND ((t."dataAcquisto" < NOW() AND t."dataCessione" IS NULL) OR (t."dataCessione" IS NOT NULL AND t."dataAcquisto" < NOW() AND t."dataCessione" > NOW()))
        AND t.stagione = p_stagione
        AND g.ruolo = p_ruolo
    GROUP BY 
        g.ruolo, g.nome, g."nomeFantaGazzetta", g."idGiocatore", s.nome, u."nomeSquadra", s.maglia, t.stagione, t."nomeSquadraSerieA", t."nomeSquadra", t."idSquadra"
    ORDER BY 
        ROUND(AVG(v.voto), 2) DESC,
        ROUND(AVG(v.voto + v.assist + v.ammonizione + v.espulsione + v.gol + v."altriBonus"), 2) DESC,
        COUNT(v.voto) DESC;
END;
$BODY$;

ALTER FUNCTION public.sp_refreshstats_a(character varying, character varying)
    OWNER TO postgres;
    
-- CreateIndex
CREATE UNIQUE INDEX "IX_Calendario_idCalendario" ON "Calendario"("idCalendario");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Formazioni_idFormazione" ON "Formazioni"("idFormazione");

-- CreateIndex
CREATE UNIQUE INDEX "UNIQUE_Formazioni_ids" ON "Formazioni"("idSquadra", "idPartita");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Giocatori_idGiocatore" ON "Giocatori"("idGiocatore");

-- CreateIndex
CREATE UNIQUE INDEX "UNIQUE_GIOCATORI_NOME" ON "Giocatori"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Partite_idPartita" ON "Partite"("idPartita");

-- CreateIndex
CREATE UNIQUE INDEX "IX_SquadreSerieA_idSquadraSerieA" ON "SquadreSerieA"("idSquadraSerieA");

-- CreateIndex
CREATE UNIQUE INDEX "IX_StatsA_id" ON "StatsA"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IX_StatsC_id" ON "StatsC"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IX_StatsD_id" ON "StatsD"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IX_StatsP_id" ON "StatsP"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Tornei_idTorneo" ON "Tornei"("idTorneo");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Trasferimenti_idTrasferimento" ON "Trasferimenti"("idTrasferimento");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Utenti_idUtente" ON "Utenti"("idUtente");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Utenti" ON "Utenti"("username", "pwd");

-- CreateIndex
CREATE UNIQUE INDEX "IX_Voti_idVoto" ON "Voti"("idVoto");

-- CreateIndex
CREATE INDEX "IX_Voti_StatsGiocatori" ON "Voti"("voto");

-- CreateIndex
CREATE INDEX "IX_Voti_StatsGiocatori2" ON "Voti"("idGiocatore");

-- CreateIndex
CREATE UNIQUE INDEX "IX_FlowSeason_id" ON "FlowNewSeasosn"("id");

-- AddForeignKey
ALTER TABLE "Calendario" ADD CONSTRAINT "FK_Calendario_Tornei" FOREIGN KEY ("idTorneo") REFERENCES "Tornei"("idTorneo") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classifiche" ADD CONSTRAINT "FK_Classifiche_Tornei" FOREIGN KEY ("idTorneo") REFERENCES "Tornei"("idTorneo") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Classifiche" ADD CONSTRAINT "FK_Classifiche_Utenti" FOREIGN KEY ("idSquadra") REFERENCES "Utenti"("idUtente") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Formazioni" ADD CONSTRAINT "FK_Formazioni_Partite" FOREIGN KEY ("idPartita") REFERENCES "Partite"("idPartita") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Formazioni" ADD CONSTRAINT "FK_Formazioni_Utenti" FOREIGN KEY ("idSquadra") REFERENCES "Utenti"("idUtente") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Partite" ADD CONSTRAINT "FK_Partite_Calendario" FOREIGN KEY ("idCalendario") REFERENCES "Calendario"("idCalendario") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Partite" ADD CONSTRAINT "FK_Partite_SquadreCasa" FOREIGN KEY ("idSquadraH") REFERENCES "Utenti"("idUtente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Partite" ADD CONSTRAINT "FK_Partite_SquadreTrasferta" FOREIGN KEY ("idSquadraA") REFERENCES "Utenti"("idUtente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trasferimenti" ADD CONSTRAINT "FK_Trasferimenti_Giocatori" FOREIGN KEY ("idGiocatore") REFERENCES "Giocatori"("idGiocatore") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trasferimenti" ADD CONSTRAINT "FK_Trasferimenti_SquadreSerieA" FOREIGN KEY ("idSquadraSerieA") REFERENCES "SquadreSerieA"("idSquadraSerieA") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trasferimenti" ADD CONSTRAINT "FK_Trasferimenti_Utenti" FOREIGN KEY ("idSquadra") REFERENCES "Utenti"("idUtente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Voti" ADD CONSTRAINT "FK_Formazione_Giocatori" FOREIGN KEY ("idFormazione") REFERENCES "Formazioni"("idFormazione") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Voti" ADD CONSTRAINT "FK_Voti_Calendario" FOREIGN KEY ("idCalendario") REFERENCES "Calendario"("idCalendario") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Voti" ADD CONSTRAINT "FK_Voti_Giocatori" FOREIGN KEY ("idGiocatore") REFERENCES "Giocatori"("idGiocatore") ON DELETE RESTRICT ON UPDATE NO ACTION;
