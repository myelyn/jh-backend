import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOnlineToUser1760349850931 implements MigrationInterface {
    name = 'AddIsOnlineToUser1760349850931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_user_current_room\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_user_sect\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_user_sect_role\``);
        await queryRunner.query(`ALTER TABLE \`sect\` CHANGE \`description\` \`introduction\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sect_role\` CHANGE \`description\` \`introduction\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isOnline\` tinyint NOT NULL COMMENT '是否在线' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`sect\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`sect\` ADD \`name\` varchar(20) NOT NULL COMMENT '门派名称'`);
        await queryRunner.query(`ALTER TABLE \`sect\` DROP COLUMN \`introduction\``);
        await queryRunner.query(`ALTER TABLE \`sect\` ADD \`introduction\` varchar(100) NOT NULL COMMENT '门派介绍'`);
        await queryRunner.query(`ALTER TABLE \`sect_role\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`sect_role\` ADD \`name\` varchar(20) NOT NULL COMMENT '角色名称'`);
        await queryRunner.query(`ALTER TABLE \`sect_role\` DROP COLUMN \`introduction\``);
        await queryRunner.query(`ALTER TABLE \`sect_role\` ADD \`introduction\` varchar(100) NOT NULL COMMENT '角色介绍'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`username\` \`username\` varchar(20) NOT NULL COMMENT '用户名，唯一，用于登录'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(50) NOT NULL COMMENT '密码'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(50) NOT NULL COMMENT '邮箱，用于验证'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(100) NULL COMMENT '头像'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isFrozen\` \`isFrozen\` tinyint NOT NULL COMMENT '是否冻结' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isAdmin\` \`isAdmin\` tinyint NOT NULL COMMENT '是否是管理员' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`currentRoomEnteredAt\` \`currentRoomEnteredAt\` timestamp NULL COMMENT '当前房间进入时间'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_847110726ddfa1ce843aa1a7d8f\` FOREIGN KEY (\`sectId\`) REFERENCES \`sect\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_e401812bb7859434243b07d937a\` FOREIGN KEY (\`sectRoleId\`) REFERENCES \`sect_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_30a9d4e64b5113a870c37770ef5\` FOREIGN KEY (\`currentRoomId\`) REFERENCES \`room\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_30a9d4e64b5113a870c37770ef5\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_e401812bb7859434243b07d937a\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_847110726ddfa1ce843aa1a7d8f\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`currentRoomEnteredAt\` \`currentRoomEnteredAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isAdmin\` \`isAdmin\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isFrozen\` \`isFrozen\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`avatar\` \`avatar\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`username\` \`username\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sect_role\` DROP COLUMN \`introduction\``);
        await queryRunner.query(`ALTER TABLE \`sect_role\` ADD \`introduction\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sect_role\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`sect_role\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sect\` DROP COLUMN \`introduction\``);
        await queryRunner.query(`ALTER TABLE \`sect\` ADD \`introduction\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sect\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`sect\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isOnline\``);
        await queryRunner.query(`ALTER TABLE \`sect_role\` CHANGE \`introduction\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sect\` CHANGE \`introduction\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_user_sect_role\` FOREIGN KEY (\`sectRoleId\`) REFERENCES \`sect_role\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_user_sect\` FOREIGN KEY (\`sectId\`) REFERENCES \`sect\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_user_current_room\` FOREIGN KEY (\`currentRoomId\`) REFERENCES \`room\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
