
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../db/schema";
import { hash } from "bcrypt";

// Direct connection to avoid import issues
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
    console.log("Starting seed process...");

    try {
        const email = "test@test.com";
        const password = "Test123";
        console.log("Hashing password...");
        const hashedPassword = await hash(password, 10);
        console.log("Password hashed.");

        console.log("Inserting admin user...");
        await db.insert(users).values({
            name: "Admin User",
            email,
            password: hashedPassword,
            role: "admin",
            isApproved: true,
        }).onConflictDoNothing();

        console.log("Admin user seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

main();
