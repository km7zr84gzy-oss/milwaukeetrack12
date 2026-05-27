import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Test script for registration logic.
 * Run with: npx tsx scripts/test-registration.ts
 * This simulates the exact operations in /api/register.
 */
async function testRegistration() {
  console.log("=== Starting registration test ===");
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "TestPass123!";
  const testName = "Test User";

  try {
    // 1. Hash password (like in register route)
    console.log("1. Hashing password...");
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log("   ✓ Hashing successful");

    // 2. Check existing user
    console.log("2. Checking for existing user...");
    const existingUser = await prisma.user.findUnique({ where: { email: testEmail } });
    if (existingUser) {
      console.log("   ✗ User already exists (unexpected)");
      return;
    }
    console.log("   ✓ No existing user");

    // 3. Create user (core of registration)
    console.log("3. Creating user...");
    const user = await prisma.user.create({
      data: {
        name: testName,
        email: testEmail,
        passwordHash: hashedPassword,
        role: "user",
        emailVerified: null,
      },
    });
    console.log(`   ✓ User created: ${user.email} (id: ${user.id})`);

    // 4. Create verification token (for email flow)
    console.log("4. Creating verification token...");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: testEmail,
        token,
        expires,
      },
    });
    console.log("   ✓ Verification token created");

    console.log("\n=== REGISTRATION TEST PASSED ===");
    console.log("User creation + token creation + hashing all successful.");

    // Cleanup
    await prisma.verificationToken.deleteMany({ where: { identifier: testEmail } });
    await prisma.user.delete({ where: { email: testEmail } });
    console.log("Test data cleaned up.");

  } catch (error: any) {
    console.error("\n=== REGISTRATION TEST FAILED ===");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Meta:", error.meta);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
