-- CreateEnum
CREATE TYPE "PlayerMode" AS ENUM ('fixed', 'random');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'jackpot', 'max_draws_reached', 'stopped');

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "player_mode" "PlayerMode" NOT NULL,
    "player_numbers" INTEGER[],
    "draw_number" INTEGER NOT NULL DEFAULT 0,
    "stats" JSONB NOT NULL DEFAULT '{"tickets":0,"yearsElapsed":0,"totalCost":0,"wins":{"2":0,"3":0,"4":0,"5":0}}',
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draw_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "draw_number" INTEGER NOT NULL,
    "player_numbers" INTEGER[],
    "draw_numbers" INTEGER[],
    "match_count" INTEGER NOT NULL,
    "drawn_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draw_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "draw_results_session_id_idx" ON "draw_results"("session_id");

-- AddForeignKey
ALTER TABLE "draw_results" ADD CONSTRAINT "draw_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
