import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),       // Added email field
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),   // Added admin flag
  createdAt: timestamp("created_at").defaultNow() // Added timestamp
});

// Added email validation to your existing schema
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email()
}).omit({ 
  id: true,
  createdAt: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Add this to fix the storage.ts error
export interface IUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}