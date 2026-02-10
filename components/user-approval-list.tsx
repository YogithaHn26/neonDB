
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
    isApproved: boolean;
    createdAt: Date;
};

export function UserApprovalList({ users }: { users: User[] }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleApprove = async (userId: number) => {
        setLoadingId(userId);
        try {
            const res = await fetch("/api/admin/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                router.refresh(); // Refresh server component data
            }
        } catch (error) {
            console.error("Failed to approve", error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {user.isApproved ? (
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Approved</Badge>
                                ) : (
                                    <Badge variant="secondary">Pending</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                {!user.isApproved && user.role !== "admin" && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(user.id)}
                                        disabled={loadingId === user.id}
                                    >
                                        {loadingId === user.id ? "Approving..." : "Approve"}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
