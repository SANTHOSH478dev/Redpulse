import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bloodRequestsTable = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  bloodType: text("blood_type").notNull(),
  hospital: text("hospital").notNull(),
  city: text("city").notNull(),
  contactPhone: text("contact_phone").notNull(),
  unitsNeeded: integer("units_needed").notNull().default(1),
  urgency: text("urgency").notNull().default("medium"),
  notes: text("notes"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBloodRequestSchema = createInsertSchema(bloodRequestsTable).omit({ id: true, createdAt: true, status: true });
export type InsertBloodRequest = z.infer<typeof insertBloodRequestSchema>;
export type BloodRequest = typeof bloodRequestsTable.$inferSelect;
