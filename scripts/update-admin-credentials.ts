
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
    console.log("Updating Admin Credentials...");
    try {
        const newEmail = "test@test.com";
        const newPassword = "Test123";
        const hashedPassword = await hash(newPassword, 10);

        // Update where role is admin (assuming single admin for now, or targeting the specific previous email)
        // We'll target the previous default email "admin@example.com" or just any admin if we want to be forceful, 
        // but let's stick to updating the specific user or upserting.

        // Strategy: Try to find existing admin and update.
        const adminUser = await db.select().from(users).where(eq(users.role, "admin")).limit(1);

        if (adminUser.length > 0) {
            console.log(`Found admin user: ${adminUser[0].email}. Updating...`);
            await db.update(users)
                .set({
                    email: newEmail,
                    password: hashedPassword,
                    name: "Admin User" // Ensure name is consistent
                })
                .where(eq(users.id, adminUser[0].id));
            console.log("Admin credentials updated successfully!");
        } else {
            console.log("No admin user found. Creating new one...");
            await db.insert(users).values({
                name: "Admin User",
                email: newEmail,
                password: hashedPassword,
                role: "admin",
                isApproved: true,
            });
            console.log("Admin user created successfully!");
        }

    } catch (e) {
        console.error("Update failed:", e);
        process.exit(1);
    }
}
main();
