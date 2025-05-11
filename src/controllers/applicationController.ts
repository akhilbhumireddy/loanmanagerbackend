import { Request, Response } from "express";
import { openDb } from "../db";

// POST /api/applications
export const createApplication = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const { userId, fullName, loanAmount, loanTenure, employmentStatus, employmentAddress, reason } = req.body;
    const createdAt = new Date().toISOString();
    await db.run(
      `INSERT INTO applications (userId, fullName, loanAmount, loanTenure, employmentStatus, employmentAddress, reason, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, fullName, loanAmount, loanTenure, employmentStatus, employmentAddress, reason, createdAt]
    );
    res.status(201).json({ message: "Application submitted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/applications/statistics?role=user&userId=1
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const { role, userId } = req.query;
    let totalRow, avgRow, approvedRow, rejectedRow;

    if (role === "user") {
      totalRow = await db.get(`SELECT COUNT(*) as total FROM applications WHERE userId = ?`, [userId]);
      avgRow = await db.get(`SELECT AVG(loanAmount) as avg FROM applications WHERE userId = ?`, [userId]);
      approvedRow = await db.get(`SELECT COUNT(*) as approved FROM applications WHERE userId = ? AND status = 'approved'`, [userId]);
      rejectedRow = await db.get(`SELECT COUNT(*) as rejected FROM applications WHERE userId = ? AND status = 'rejected'`, [userId]);
    } else {
      totalRow = await db.get(`SELECT COUNT(*) as total FROM applications`);
      avgRow = await db.get(`SELECT AVG(loanAmount) as avg FROM applications`);
      approvedRow = await db.get(`SELECT COUNT(*) as approved FROM applications WHERE status = 'approved'`);
      rejectedRow = await db.get(`SELECT COUNT(*) as rejected FROM applications WHERE status = 'rejected'`);
    }

    const successRate = totalRow.total > 0 ? (approvedRow.approved / totalRow.total) * 100 : 0;

    res.json({
      totalApplications: totalRow.total,
      averageLoanAmount: avgRow.avg || 0,
      approved: approvedRow.approved,
      rejected: rejectedRow.rejected,
      successRate: successRate.toFixed(2)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applications?role=user&userId=1
export const getApplications = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const { role, userId } = req.query;
    let apps;
    if (role === "user") {
      apps = await db.all(`SELECT * FROM applications WHERE userId = ? ORDER BY createdAt DESC`, [userId]);
    } else {
      apps = await db.all(`SELECT * FROM applications ORDER BY createdAt DESC`);
    }
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const { id } = req.params;
    const { status } = req.body;
    await db.run(`UPDATE applications SET status = ? WHERE id = ?`, [status, id]);
    res.json({ message: "Status updated" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
