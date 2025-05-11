import express from "express";
import { openDb } from "../db";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const db = await openDb();
    const result = await db.run(
      `INSERT INTO users (name, email, role) VALUES (?, ?, ?)`,
      [name, email, role]
    );
    res.status(201).json({ id: result.lastID, name, email, role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const db = await openDb();
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (user) res.json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
