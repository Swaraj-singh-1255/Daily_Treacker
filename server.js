const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "progress-data.json");

app.use(cors());
app.use(express.json());

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  console.log("✅ Created progress-data.json");
}

// GET — Load all progress data
app.get("/api/progress", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST — Save progress data
app.post("/api/progress", (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: "Data saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — Export backup as JSON download
app.get("/api/export", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const date = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Disposition", `attachment; filename=swaraj_backup_${date}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST — Import/restore backup
app.post("/api/import", (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: "Data restored!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — Health check
app.get("/api/health", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json({
    success: true,
    message: "Server running!",
    daysRecorded: Object.keys(data).length,
    dataFile: DATA_FILE,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Progress Tracker Backend running!`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`💾 Data saved to: ${DATA_FILE}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/progress  — load data`);
  console.log(`  POST /api/progress  — save data`);
  console.log(`  GET  /api/export    — download backup`);
  console.log(`  POST /api/import    — restore backup`);
});
