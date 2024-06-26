const express = require("express");
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(fileUpload());

const exceedDirSizeLimit = (fileIncoming, dirToCheck) => {
  const uploadDirLimit = 50 * 1024 * 1024; // 50 Mb
  const files = fs.readdirSync(dirToCheck);
  const totalSize = files.reduce((acc, file) => {
    const filePath = path.join(dirToCheck, file);
    const stats = fs.statSync(filePath);
    return acc + stats.size;
  }, fileIncoming.size);
  return totalSize > uploadDirLimit;
};

app.get("/wake-up-server", (req, res) => {
  return res.status(200).json({ serverIsOn: true });
});

app.get("/upload/:filename", (req, res) => {
  const fileName = req.params.filename;

  if (!fileName) {
    return res
      .status(400)
      .json({ success: false, error: "File name is missing." });
  }

  const absolutePath = path.join(__dirname, "upload", fileName);
  res.sendFile(absolutePath);
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded",
    });
  }

  const uploadDir = path.join(__dirname, "upload");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const file = req.files.file;

  if (exceedDirSizeLimit(file, uploadDir)) {
    return res.status(507).json({
      success: false,
      error:
        "Not enough cloud storage for uploading all files, current limit is 50 MiB.",
    });
  }

  const fileName = uuidv4() + path.extname(file.name);

  file.mv(`${uploadDir}/${fileName}`, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err,
      });
    }
    res.status(200).json({
      success: true,
      filePath: `/upload/${fileName}`,
    });
  });
});

app.delete("/delete", (req, res) => {
  const filePaths = req.query.fileNames.split(",");
  try {
    filePaths.forEach((filePath) => {
      fs.unlinkSync(`${__dirname}/${filePath}`);
    });
    res
      .status(200)
      .json({ success: true, message: "Files deleted successfully." });
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
