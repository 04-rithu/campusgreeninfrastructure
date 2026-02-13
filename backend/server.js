const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");

// Route imports
const plannerRoutes = require("./routes/plannerRoutes");
const wateringRoutes = require("./routes/wateringRoutes");
const pesticideRoutes = require("./routes/pesticideRoutes");
const trimmingRoutes = require("./routes/trimmingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", plannerRoutes); // Fixed: Mounted at /api so /zones works
app.use("/api/watering", wateringRoutes);
app.use("/api/pesticide", pesticideRoutes);
app.use("/api/trimming", trimmingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);
  console.log(`Mongo URI: ${process.env.MONGO_URI ? 'Set' : 'Missing'}`);
});
