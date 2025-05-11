import express from "express";
import cors from "cors";
import applicationRoutes from "./routes/applicationRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

export default app;