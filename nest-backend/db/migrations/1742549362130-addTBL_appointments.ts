import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLAppointments1742549362130 implements MigrationInterface {
    name = 'AddTBLAppointments1742549362130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "date" date NOT NULL, "time" TIME NOT NULL, "reason" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
    }

}
