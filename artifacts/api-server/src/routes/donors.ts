import { Router, type IRouter } from "express";
import { db, donorsTable, bloodRequestsTable, insertDonorSchema } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  CreateDonorBody,
  GetDonorsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/donors", async (req, res) => {
  try {
    const query = GetDonorsQueryParams.parse(req.query);
    const conditions = [];
    if (query.bloodType) conditions.push(eq(donorsTable.bloodType, query.bloodType));
    if (query.city) conditions.push(ilike(donorsTable.city, `%${query.city}%`));

    const donors = await db
      .select()
      .from(donorsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(donorsTable.createdAt);

    const result = donors.map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
      lastDonation: d.lastDonation ?? null,
    }));
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

router.post("/donors", async (req, res) => {
  try {
    const body = CreateDonorBody.parse(req.body);
    const parsed = insertDonorSchema.parse(body);
    const [donor] = await db.insert(donorsTable).values(parsed).returning();
    res.status(201).json({
      ...donor,
      createdAt: donor.createdAt.toISOString(),
      lastDonation: donor.lastDonation ?? null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid donor data" });
  }
});

router.get("/donors/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [donor] = await db.select().from(donorsTable).where(eq(donorsTable.id, id));
    if (!donor) return void res.status(404).json({ error: "Donor not found" });
    res.json({
      ...donor,
      createdAt: donor.createdAt.toISOString(),
      lastDonation: donor.lastDonation ?? null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch donor" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalDonorsRow] = await db.select({ count: sql<number>`count(*)::int` }).from(donorsTable);
    const [availableDonorsRow] = await db.select({ count: sql<number>`count(*)::int` }).from(donorsTable).where(eq(donorsTable.isAvailable, true));

    const bloodTypeRows = await db
      .select({ bloodType: donorsTable.bloodType, count: sql<number>`count(*)::int` })
      .from(donorsTable)
      .groupBy(donorsTable.bloodType);

    const bloodTypeBreakdown: Record<string, number> = {};
    for (const row of bloodTypeRows) {
      bloodTypeBreakdown[row.bloodType] = row.count;
    }

    const [totalRequestsRow] = await db.select({ count: sql<number>`count(*)::int` }).from(bloodRequestsTable);
    const [openRequestsRow] = await db.select({ count: sql<number>`count(*)::int` }).from(bloodRequestsTable).where(eq(bloodRequestsTable.status, "open"));

    res.json({
      totalDonors: totalDonorsRow.count,
      availableDonors: availableDonorsRow.count,
      totalRequests: totalRequestsRow.count,
      openRequests: openRequestsRow.count,
      bloodTypeBreakdown,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
