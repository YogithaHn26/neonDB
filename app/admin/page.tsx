
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserApprovalList } from "@/components/user-approval-list";
import { AnalyticsOverview } from "@/components/analytics-overview";
import { SignOutButton } from "@/components/sign-out-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/dashboard");
    }

    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">User View</Link>
                    </Button>
                    <span>{session.user?.name} (Admin)</span>
                    <SignOutButton />
                </div>
            </header>
            <main className="flex-1 p-6 space-y-6">
                <AnalyticsOverview />
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserApprovalList users={allUsers} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
