const libre = require("libreoffice-convert");
const fs = require("fs");
const path = require("path");

exports.convertDocument = (req, res) => {
  const { format } = req.body; // e.g., '.pdf'
  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, '../output/');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputPath = path.join(outputDir, Date.now() + `${format}`);

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
};