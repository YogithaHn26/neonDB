
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            // Default to user role and not approved
        }).returning();

        return NextResponse.json({ user: newUser[0] });
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
