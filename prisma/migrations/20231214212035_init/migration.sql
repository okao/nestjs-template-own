-- AlterTable
ALTER TABLE `users` ADD COLUMN `authProviderId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `statusId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `roleId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `authProviders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `authProviders_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
