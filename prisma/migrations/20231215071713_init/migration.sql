-- AlterTable
ALTER TABLE `authProviders` ADD COLUMN `clientId` VARCHAR(191) NULL,
    ADD COLUMN `clientSecret` VARCHAR(191) NULL;
