import { Router, type IRouter } from "express";
import { db, bloodRequestsTable, insertBloodRequestSchema } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import {
  CreateBloodRequestBody,
  GetBloodRequestsQueryParams,
  UpdateBloodRequestBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blood-requests", async (req, res) => {
  try {
    const query = GetBloodRequestsQueryParams.parse(req.query);
    const conditions = [];
    if (query.bloodType) conditions.push(eq(bloodRequestsTable.bloodType, query.bloodType));
    if (query.urgency) conditions.push(eq(bloodRequestsTable.urgency, query.urgency));

    const requests = await db
      .select()
      .from(bloodRequestsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(bloodRequestsTable.createdAt);

    const result = requests.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      notes: r.notes ?? null,
    }));
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
});

router.post("/blood-requests", async (req, res) => {
  try {
    const body = CreateBloodRequestBody.parse(req.body);
    const parsed = insertBloodRequestSchema.parse(body);
    const [request] = await db.insert(bloodRequestsTable).values(parsed).returning();
    res.status(201).json({
      ...request,
      createdAt: request.createdAt.toISOString(),
      notes: request.notes ?? null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid blood request data" });
  }
});

router.patch("/blood-requests/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = UpdateBloodRequestBody.parse(req.body);
    const [request] = await db
      .update(bloodRequestsTable)
      .set(body)
      .where(eq(bloodRequestsTable.id, id))
      .returning();
    if (!request) return void res.status(404).json({ error: "Blood request not found" });
    res.json({
      ...request,
      createdAt: request.createdAt.toISOString(),
      notes: request.notes ?? null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update blood request" });
  }
});

export default router;
