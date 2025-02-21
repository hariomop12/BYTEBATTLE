const fileValidator = (allowedTypes, maxSizeMB) => {
    return (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const fileType = req.file.mimetype;
      const fileSize = req.file.size;
  
      // Validate file type
      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json({ error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` });
      }
  
      // Validate file size 
      if (fileSize > maxSizeMB * 1024 * 1024) {
        return res.status(400).json({ error: `File size exceeds ${maxSizeMB} MB limit` });
      }
      next();  
    };
  };
  
module.exports = fileValidator;
