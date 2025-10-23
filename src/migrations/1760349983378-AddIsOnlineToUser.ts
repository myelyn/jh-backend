import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOnlineToUser1760349983378 implements MigrationInterface {
    name = 'AddIsOnlineToUser1760349983378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isOnline\` \`isConnected\` tinyint NOT NULL COMMENT '是否在线' DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isConnected\` \`isOnline\` tinyint NOT NULL COMMENT '是否在线' DEFAULT '0'`);
    }

}
