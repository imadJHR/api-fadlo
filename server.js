import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

import { connectDB } from "./config/db.js";
import vehiculeRoutes from "./routes/vehiculeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

dotenv.config();

const app = express();

/**
 * ✅ CORS OPEN (tout ouvrir)
 * - origin: "*"
 * - credentials: false (obligatoire avec *)
 */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// ✅ CORS avant les routes
app.use(cors(corsOptions));

// ✅ Preflight partout (même config)
app.options(/.*/, cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Healthcheck
app.get("/hello", (req, res) => {
  res.status(200).json({ status: "ok", message: "hello world" });
});

// Routes
app.use("/api", authRoutes); // POST /api/login
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/vehicules", vehiculeRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export Lambda handler
export const handler = serverless(app);

// Local dev only
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 3000, () =>
    console.log("Serveur lancé sur le port " + (process.env.PORT || 3000))
  );
}