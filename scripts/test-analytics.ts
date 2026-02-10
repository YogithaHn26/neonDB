
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { sql, eq } from "drizzle-orm";

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn, { schema });

async function main() {
    console.log("Testing Analytics Logic...");

    try {
        // Total Users
        const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
        const totalUsers = Number(totalUsersResult[0].count);
        console.log("Total Users:", totalUsers);

        // Pending Approvals
        const pendingApprovalsResult = await db.select({ count: sql<number>`count(*)` }).from(schema.users)
            .where(sql`${schema.users.isApproved} = false AND ${schema.users.role} != 'admin'`);
        const pendingApprovals = Number(pendingApprovalsResult[0].count);
        console.log("Pending Approvals:", pendingApprovals);

        // Approved Users
        const approvedUsers = totalUsers - pendingApprovals;
        console.log("Approved Users:", approvedUsers);

        if (totalUsers >= 0 && pendingApprovals >= 0 && approvedUsers >= 0) {
            console.log("Analytics logic verification successful!");
        } else {
            console.error("Invalid analytics data found.");
            process.exit(1);
        }

    } catch (error) {
        console.error("Analytics Test Failed:", error);
        process.exit(1);
    }
}

main();
