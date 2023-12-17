/*
  Warnings:

  - You are about to drop the column `authProviderId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `authProviders` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `apiUrl` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `loginUrl` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `siteSettings` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `authProviderId`,
    ADD COLUMN `defaultAuthProviderId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `userAuthProviders` (
    `authId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `authProviderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `userAuthProviders_authId_key`(`authId`),
    PRIMARY KEY (`authId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userAuthProviders` ADD CONSTRAINT `userAuthProviders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userAuthProviders` ADD CONSTRAINT `userAuthProviders_authProviderId_fkey` FOREIGN KEY (`authProviderId`) REFERENCES `authProviders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
