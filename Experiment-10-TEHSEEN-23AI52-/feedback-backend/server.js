const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 5000; // backend will run on http://localhost:5000
const DATA_FILE = "feedback.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper: load feedback
function loadFeedback() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  }
  return [];
}

// Helper: save feedback
function saveFeedback(feedbackList) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(feedbackList, null, 2));
}

// Route: submit feedback
app.post("/feedback", (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) {
    return res.status(400).json({ error: "Rating is required" });
  }

  const feedbackList = loadFeedback();
  const newFeedback = {
    id: Date.now(),
    rating,
    comment: comment || "",
  };
  feedbackList.push(newFeedback);
  saveFeedback(feedbackList);

  res.json({ message: "Feedback saved!", feedback: newFeedback });
});

// Route: get all feedback
app.get("/feedback", (req, res) => {
  const feedbackList = loadFeedback();
  res.json(feedbackList);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});