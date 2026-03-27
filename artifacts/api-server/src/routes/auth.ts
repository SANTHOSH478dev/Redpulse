import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterUserBody, LoginUserBody } from "@workspace/api-zod";

const router: IRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "redpulse-secret-2026";

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterUserBody.parse(req.body);
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing.length > 0) {
      return void res.status(400).json({ error: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(body.password, 10);
    const [user] = await db.insert(usersTable).values({
      name: body.name,
      email: body.email,
      passwordHash,
    }).returning();

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, donorId: user.donorId ?? null },
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginUserBody.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user) return void res.status(401).json({ error: "Invalid email or password" });
    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return void res.status(401).json({ error: "Invalid email or password" });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, donorId: user.donorId ?? null },
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Login failed" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return void res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.id));
    if (!user) return void res.status(401).json({ error: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email, donorId: user.donorId ?? null });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
