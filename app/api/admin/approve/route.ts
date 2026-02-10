
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { userId } = await req.json();

        // Using simple update
        await db.update(users)
            .set({ isApproved: true })
            .where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("APPROVAL_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
