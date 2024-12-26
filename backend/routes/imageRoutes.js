const express = require("express");
const multer = require("multer");
const fileValidator = require("../middleware/fileValidator");
const { convertImage } = require("../controllers/imageController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "application/pdf",
];
const maxImageSizeMB = 5;

router.post(
  "/",
  upload.single("file"),
  fileValidator(allowedImageTypes, maxImageSizeMB),
  convertImage
);

module.exports = router;
