import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTBLAppointmentsStatus1742553059713 implements MigrationInterface {
    name = 'UpdateTBLAppointmentsStatus1742553059713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum" AS ENUM('Scheduled', 'Completed', 'Cancelled')`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'Scheduled'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    }

}
