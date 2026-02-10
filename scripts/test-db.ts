
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
    console.log("Testing connection via Neon Serverless (WebSockets)...");
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`SELECT version()`;
        console.log("Connection successful!");
        console.log("Version:", result[0].version);
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

main();
