import express from "express";
import { createApplication, getStatistics, getApplications, updateApplicationStatus } from "../controllers/applicationController";
const router = express.Router();

router.post("/", createApplication);
router.get("/statistics", getStatistics);
router.get("/", getApplications);
router.patch("/:id/status", updateApplicationStatus);

export default router;
