const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

exports.convertImage = async (req, res) => {
  const { format } = req.body; // e.g., 'png'
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, '../output/', Date.now() + `.${format}`);

  try {
    if (format === 'pdf', 'bmp') {
      const imageBuffer = await sharp(inputPath).toBuffer();
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const pngImage = await pdfDoc.embedPng(imageBuffer);
      const { width, height } = pngImage.scale(1);
      page.drawImage(pngImage, {
        x: 0,
        y: page.getHeight() - height,
        width,
        height,
      });
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
    } else {
      await sharp(inputPath).toFormat(format).toFile(outputPath);
    }

    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: 'Image conversion failed', details: err.message });
  }
};