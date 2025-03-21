import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTBLAppointments1742550798169 implements MigrationInterface {
    name = 'UpdateTBLAppointments1742550798169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "doctorId" integer`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "patientId" integer`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_514bcc3fb1b8140f85bf1cde6e2" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_5ce4c3130796367c93cd817948e" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_5ce4c3130796367c93cd817948e"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_514bcc3fb1b8140f85bf1cde6e2"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "patientId"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "doctorId"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
