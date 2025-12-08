import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

// ======== Middleware ========
// CORS setup for localhost + deployed frontends
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://mern-stack-project-2-9hqb.onrender.com", // deployed frontend
  "https://mern-stack-project-1-ahdo.onrender.com", // backend itself
  "https://fullstackproject23.netlify.app", // optional frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// ======== Body Parsing ========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======== MongoDB Connection ========
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ======== Default Route ========
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// ======== API Routes ========
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/cart", cartRoutes);

// ======== Start Server ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
