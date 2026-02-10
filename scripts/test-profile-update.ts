
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn, { schema });

async function main() {
    console.log("Testing Profile Update Logic...");
    const testEmail = "test@test.com"; // Using the admin user we set up
    const newName = "Updated Admin Name " + Date.now();

    try {
        // 1. Get current user
        const user = await db.query.users.findFirst({
            where: eq(schema.users.email, testEmail),
        });

        if (!user) {
            console.error("Test user not found!");
            process.exit(1);
        }

        console.log(`Current Name: ${user.name}`);

        // 2. Update Name
        console.log(`Updating name to: ${newName}`);
        await db.update(schema.users)
            .set({ name: newName })
            .where(eq(schema.users.id, user.id));

        // 3. Verify Update
        const updatedUser = await db.query.users.findFirst({
            where: eq(schema.users.id, user.id),
        });

        if (updatedUser?.name === newName) {
            console.log("SUCCESS: Name updated successfully.");
        } else {
            console.error("FAILURE: Name update did not persist.");
            process.exit(1);
        }

        // Revert change
        console.log("Reverting name change...");
        await db.update(schema.users)
            .set({ name: "Admin User" })
            .where(eq(schema.users.id, user.id));

    } catch (error) {
        console.error("Profile Update Test Failed:", error);
        process.exit(1);
    }
}

main();
