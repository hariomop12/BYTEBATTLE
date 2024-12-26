const express = require("express");
const multer = require("multer");
const { convertDocument } = require("../controllers/documentController");
const path = require("path");
const fs = require("fs");
const libre = require("libreoffice-convert");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.post(
  "/",
  upload.single("file"), 
  (req, res, next) => {
    console.log("🔍 Request Body (raw):", req.body);
    console.log("🔍 Uploaded File:", req.file);

    const { format } = req.body; 
    if (!format) {
      console.error("⚠️ Format not provided.");
      return res.status(400).json({ error: "Format is required." });
    }

    req.format = format;
    next();
  },
  async (req, res) => {
    try {
      const { format } = req;
      const inputPath = path.join(__dirname, "../uploads", req.file.originalname);
      const outputDir = path.join(__dirname, "../output/");
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const outputPath = path.join(outputDir, Date.now() + `${format}`);

      fs.writeFileSync(inputPath, req.file.buffer);

      fs.readFile(inputPath, (err, data) => {
        if (err)
          return res
            .status(500)
            .json({ error: "File read error", details: err.message });

        libre.convert(data, format, undefined, (convertErr, done) => {
          if (convertErr)
            return res
              .status(500)
              .json({ error: "Conversion failed", details: convertErr.message });

          fs.writeFileSync(outputPath, done);
          res.download(outputPath, () => {
            fs.unlinkSync(inputPath);
            // Comment out the line below if you want to keep the output file
            // fs.unlinkSync(outputPath);
          });
        });
      });
    } catch (error) {
      console.error("❌ Error converting document:", error.message);
      res
        .status(500)
        .json({ error: "An error occurred while converting the document." });
    }
  }
);

module.exports = router;