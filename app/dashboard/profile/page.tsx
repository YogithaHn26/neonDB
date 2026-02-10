
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/profile-form";
import { SignOutButton } from "@/components/sign-out-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // Fetch fresh user data
    const user = await db.query.users.findFirst({
        where: eq(users.id, Number(session.user.id)),
    });

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                    <h1 className="text-xl font-bold">Profile</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span>{user.name}</span>
                    <SignOutButton />
                </div>
            </header>
            <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
                <ProfileForm initialName={user.name} initialEmail={user.email} />
            </main>
        </div>
    );
}
