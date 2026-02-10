
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
    console.log("Verifying seed...");
    try {
        const admin = await db.select().from(users).where(eq(users.email, "admin@example.com"));
        if (admin.length > 0) {
            console.log("Admin user found:", admin[0].email);
            console.log("Role:", admin[0].role);
        } else {
            console.error("Admin user not found!");
            process.exit(1);
        }
    } catch (e) {
        console.error("Verification failed:", e);
        process.exit(1);
    }
}
main();
