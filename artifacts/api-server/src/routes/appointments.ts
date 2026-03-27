import { Router, type IRouter } from "express";
import { db, appointmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateAppointmentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/appointments", async (req, res) => {
  try {
    const email = req.query.email as string | undefined;
    let query = db.select().from(appointmentsTable).$dynamic();
    if (email) {
      query = query.where(eq(appointmentsTable.donorEmail, email));
    }
    const appointments = await query.orderBy(appointmentsTable.createdAt);
    res.json(appointments.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const body = CreateAppointmentBody.parse(req.body);
    const [appointment] = await db.insert(appointmentsTable).values({
      donorEmail: body.donorEmail,
      donorName: body.donorName,
      date: body.date,
      time: body.time,
      center: body.center,
      status: "Under Review",
    }).returning();

    // Auto-approve after 10 seconds (simulated)
    setTimeout(async () => {
      try {
        await db.update(appointmentsTable)
          .set({ status: "Approved" })
          .where(eq(appointmentsTable.id, appointment.id));
      } catch (_) {}
    }, 10000);

    res.status(201).json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to book appointment" });
  }
});

router.get("/appointments/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let [appointment] = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, id));
    if (!appointment) return void res.status(404).json({ error: "Appointment not found" });

    // Auto-approve if still Under Review and more than 8 seconds have passed
    if (appointment.status === "Under Review") {
      const ageMs = Date.now() - appointment.createdAt.getTime();
      if (ageMs >= 8000) {
        const [updated] = await db
          .update(appointmentsTable)
          .set({ status: "Approved" })
          .where(eq(appointmentsTable.id, id))
          .returning();
        appointment = updated;
      }
    }

    res.json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

export default router;
