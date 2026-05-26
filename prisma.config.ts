// Prisma 7 config for MilwaukeeTrack
// Loads environment variables so Prisma CLI and runtime can use DATABASE_URL for Aurora Postgres.
import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
