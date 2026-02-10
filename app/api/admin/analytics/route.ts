
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Total Users
        const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
        const totalUsers = Number(totalUsersResult[0].count);

        // Pending Approvals
        const pendingApprovalsResult = await db.select({ count: sql<number>`count(*)` }).from(users)
            .where(sql`${users.isApproved} = false AND ${users.role} != 'admin'`);
        const pendingApprovals = Number(pendingApprovalsResult[0].count);

        // Approved Users
        const approvedUsers = totalUsers - pendingApprovals;

        // Mock trend data (real implementation would require grouping by date)
        // For now, we'll return a static trend or simplified one if created_at is available
        const trendData = [
            { name: 'Mon', users: 4 },
            { name: 'Tue', users: 3 },
            { name: 'Wed', users: 2 },
            { name: 'Thu', users: 7 },
            { name: 'Fri', users: 5 },
            { name: 'Sat', users: 2 },
            { name: 'Sun', users: 3 },
        ];

        return NextResponse.json({
            totalUsers,
            pendingApprovals,
            approvedUsers,
            trendData
        });
    } catch (error) {
        console.error("ANALYTICS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
