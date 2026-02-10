
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>{session.user?.name}</span>
                    <SignOutButton />
                </div>
            </header>
            <main className="flex-1 p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {session.user?.name}!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            You have successfully logged in. This is your protected dashboard.
                        </p>
                        {session.user?.role === "admin" && (
                            <div className="mt-4">
                                <Button asChild>
                                    <Link href="/admin">Go to Admin Panel</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
