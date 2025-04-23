"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserSchema = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(), // Added email field
    password: (0, pg_core_1.text)("password").notNull(),
    isAdmin: (0, pg_core_1.boolean)("is_admin").default(false), // Added admin flag
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow() // Added timestamp
});
// Added email validation to your existing schema
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users, {
    email: zod_1.z.string().email()
}).omit({
    id: true,
    createdAt: true
});
