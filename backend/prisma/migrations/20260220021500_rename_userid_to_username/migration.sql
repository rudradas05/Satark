-- Rename userId column to userName
ALTER TABLE "User" RENAME COLUMN "userId" TO "userName";

-- Keep index name aligned with the renamed column
ALTER INDEX "User_userId_key" RENAME TO "User_userName_key";
