import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOnlineToUser1760363090954 implements MigrationInterface {
    name = 'AddIsOnlineToUser1760363090954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isConnected\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isConnected\` tinyint NOT NULL COMMENT '是否在线' DEFAULT '0'`);
    }

}
