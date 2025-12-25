import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import vehiculeRoutes from "./routes/vehiculeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

// Import pour serverless
import serverless from "serverless-http";

dotenv.config();

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/hello", (req, res) => {
  res.status(200).json({ status: "ok", message: "hello world" });
});

app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/messages", messageRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/vehicules", vehiculeRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export pour serverless
export const handler = serverless(app);

// Lancement local uniquement si exécuté directement
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 3000, () =>
    console.log("Serveur lancé sur le port " + (process.env.PORT || 3000))
  );
}