/*
  Warnings:

  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles";

-- DropEnum
DROP TYPE "Role";
