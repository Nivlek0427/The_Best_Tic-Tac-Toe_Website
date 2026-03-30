const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("Public"));

// Routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.post("/api/data", (req, res) => {
  const body = req.body;
  res.json({ received: body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});