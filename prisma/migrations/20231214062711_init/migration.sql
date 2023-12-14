/*
  Warnings:

  - You are about to drop the `setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `setting`;

-- CreateTable
CREATE TABLE `siteSettings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `siteSettings_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
