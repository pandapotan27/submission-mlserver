const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 3000;

// Multer setup
const upload = multer({
  limits: { fileSize: 1000000 }, // Maksimal ukuran file 1MB
});

// API Endpoint /predict
app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }

  const result = Math.random() > 0.5 ? "Cancer" : "Non-cancer";
  const response = {
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: uuid.v4(),
      result: result,
      suggestion:
        result === "Cancer"
          ? "Segera periksa ke dokter!"
          : "Penyakit kanker tidak terdeteksi.",
      createdAt: moment().toISOString(),
    },
  };

  res.json(response);
});

// Error handler untuk file lebih dari 1MB
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
