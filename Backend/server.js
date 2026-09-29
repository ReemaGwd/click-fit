const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------
// PATH CONFIGURATION
// ---------------------------------------------------------

// Frontend location
const frontendPath = path.join(__dirname, "..", "Frontend");

// Upload folder - project root/upload_images
const uploadPath = path.join(__dirname, "..", "upload_images");

// Create upload folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ---------------------------------------------------------
// MIDDLEWARE
// ---------------------------------------------------------

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------
// IMAGE UPLOAD CONFIGURATION
// ---------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(null, `${Date.now()}-${safeName}`);
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// ---------------------------------------------------------
// IMAGE UPLOAD API
// ---------------------------------------------------------

app.post("/api/upload", upload.single("image"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select an image."
    });
  }

  res.json({
    success: true,
    message: "Image uploaded successfully.",
    filename: req.file.filename,
    path: `/upload_images/${req.file.filename}`
  });
});

// ---------------------------------------------------------
// SERVE UPLOADED IMAGES
// ---------------------------------------------------------

app.use("/upload_images", express.static(uploadPath));

// ---------------------------------------------------------
// SERVE FRONTEND
// ---------------------------------------------------------

app.use(express.static(frontendPath));

// ---------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------

app.get("/", function (req, res) {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------------------------------------
// ERROR HANDLER
// ---------------------------------------------------------

app.use(function (err, req, res, next) {
  console.error(err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong."
  });
});

// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------

app.listen(PORT, function () {
  console.log(`Click Fit is running at http://localhost:${PORT}`);
});