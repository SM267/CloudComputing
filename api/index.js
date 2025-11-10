const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const bookingSchema = new mongoose.Schema({
  eventTitle: String,
  userEmail: String,
  date: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// ➕ Add a booking
app.post("/api/book", async (req, res) => {
  try {
    const { eventTitle, userEmail } = req.body;
    if (!eventTitle || !userEmail)
      return res.status(400).json({ message: "Missing fields" });

    const newBooking = new Booking({ eventTitle, userEmail });
    await newBooking.save();
    res.json({ message: "🎉 Booking stored successfully!" });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// 📜 Fetch bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Export Express app for Vercel
module.exports = app;
