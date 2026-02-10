
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "admin" | "user";
            isApproved: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "admin" | "user";
        isApproved: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "admin" | "user";
    }
}
