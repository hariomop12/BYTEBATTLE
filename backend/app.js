const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Route imports
const imageRoutes = require("./routes/imageRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/convertImage", imageRoutes); // Example route for images
app.use("/convertDocument", documentRoutes); // Route for document conversion

 
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Server</h1>
    <p>Server is running on port ${PORT}</p>
    <p>API Endpoints:</p>
    <ul>
      <li><a href="/convertImage">Convert Image</a></li>
      <li><a href="/convertDocument">Convert Document</a></li>
    </ul>
    <p>Environment: ${process.env.NODE_ENV || "development"}</p>
  `);
});

// Start server hee
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
