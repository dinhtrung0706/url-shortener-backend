require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const app = express();
app.use(express.json());

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/urls", async (req, res) => {
  const newUrl = await Url.create({
    originalUrl: req.body.originalUrl,
    shortCode: req.body.shortCode,
  });

  res.json(newUrl);
});

app.get("/api/urls", async (req, res) => {
  const urls = await Url.find();
  res.json(urls);
});

app.get("/api/urls/:id", async (req, res) => {
  const url = await Url.findById(req.params.id);
  res.json(url);
});

app.get("/:shortCode", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode });

  if (!url) {
    return res.send("Not found");
  }

  url.clicks += 1;
  await url.save();

  res.redirect(url.originalUrl);
});

app.get("/", (req, res) => {
  // This is health check endpoint, it should return 200 OK
  res.send("URL Shortener API is running");
})

async function startServer() {
  try {
    await mongoose.connect(mongoUri);

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
