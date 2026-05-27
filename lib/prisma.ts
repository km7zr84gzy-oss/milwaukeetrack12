import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connections during hot reloads in Next.js.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Prisma 7 + prisma.config.ts pattern (recommended):
// Do NOT pass datasourceUrl in the constructor when using prisma.config.ts.
// The config file owns the datasource. Passing it here triggers "never" type + engine client errors.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
