/*
  Warnings:

  - Added the required column `geolocation` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "geolocation" extensions.geometry(Point, 4326) NOT NULL;

-- CreateIndex
CREATE INDEX "address_idx" ON "addresses" USING GIST ("geolocation");
