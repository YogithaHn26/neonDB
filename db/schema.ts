
import { pgTable, serial, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').default('user').notNull(),
    isApproved: boolean('is_approved').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
