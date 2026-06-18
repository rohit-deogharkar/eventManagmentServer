require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const connectDB    = require("./config/mongodb.config");
const authRoutes   = require("./routes/auth.route");
const eventRoutes  = require("./routes/event.route");

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});