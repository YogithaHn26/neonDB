
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../db/schema"
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
    console.log("Starting Auth Logic Test...");
    const testEmail = "testuser_" + Date.now() + "@example.com";
    const testPassword = "password123";

    try {
        // 1. Register User
        console.log(`1. Registering user: ${testEmail}`);
        const hashedPassword = await hash(testPassword, 10);
        const [newUser] = await db.insert(users).values({
            name: "Test User",
            email: testEmail,
            password: hashedPassword,
            role: "user", // Default role
            isApproved: false, // Default unapproved
        }).returning();
        console.log("   User registered with ID:", newUser.id);

        // 2. Simulate Login (Unapproved)
        console.log("2. Testing Login (Unapproved Info)...");
        const userUnapproved = await db.query.users.findFirst({
            where: eq(users.email, testEmail),
        });

        if (!userUnapproved) throw new Error("User not found!");

        const passwordValid = await compare(testPassword, userUnapproved.password);
        if (!passwordValid) throw new Error("Password mismatch!");

        if (!userUnapproved.isApproved && userUnapproved.role !== 'admin') {
            console.log("   SUCCESS: Login blocked as expected (User not approved).");
        } else {
            console.error("   FAILURE: Login allowed but should be blocked!");
            process.exit(1);
        }

        // 3. Approve User
        console.log("3. Approving User manually...");
        await db.update(users).set({ isApproved: true }).where(eq(users.id, newUser.id));
        console.log("   User approved.");

        // 4. Simulate Login (Approved)
        console.log("4. Testing Login (Approved)...");
        const userApproved = await db.query.users.findFirst({
            where: eq(users.email, testEmail),
        });

        if (!userApproved) throw new Error("User not found after approval!");

        if (userApproved.isApproved || userApproved.role === 'admin') {
            console.log("   SUCCESS: Login allowed as expected.");
        } else {
            console.error("   FAILURE: Login blocked but should be allowed!");
            process.exit(1);
        }

        // Cleanup
        console.log("5. Cleaning up test user...");
        await db.delete(users).where(eq(users.id, newUser.id));
        console.log("   Cleanup complete.");

    } catch (error) {
        console.error("Test Failed:", error);
        const fs = require('fs');
        fs.writeFileSync('test-auth-error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        process.exit(1);
    }
}

main();
