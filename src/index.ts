import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { seedAdmin } from "./utils/seedAdmin";
import { seedIntroduction } from "./utils/seedIntroduction";
import authRoutes from "./app/auth/routes";
import userRoutes from "./app/user/routes";
import adminRoutes from "./app/admin/routes";
import contentRoutes from "./app/content/routes";
import feedbackRoutes from "./app/feedback/routes";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI as string);
mongoose.connection.on("error", console.error.bind(console, "MongoDB error:"));
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  await seedAdmin();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://tafseer-client.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.get("/health", (_req: Request, res: Response) => res.sendStatus(200));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/content", contentRoutes);
app.use("/feedback", feedbackRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
