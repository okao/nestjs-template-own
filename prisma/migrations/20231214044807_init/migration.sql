/*
  Warnings:

  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `settings`;

-- CreateTable
CREATE TABLE `setting` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `setting_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
