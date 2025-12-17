import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import path from "path";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const app = express();

/* =========================
   ENV / CONFIG
========================= */

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is not set");
}

const PORT = 8080;
const ACCOUNT_NAME = "aiimgupl87343";
const CONTAINER_NAME = "images";

/* =========================
   SECURITY
========================= */

// Allow health checks without auth
app.use((req, res, next) => {
  if (req.path === "/health") return next();

  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
});

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

/* =========================
   FILE UPLOAD (MULTER)
========================= */

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads allowed"));
    }
    cb(null, true);
  },
});

/* =========================
   AZURE STORAGE (MANAGED ID)
========================= */

const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT_NAME}.blob.core.windows.net`,
  credential
);

const containerClient =
  blobServiceClient.getContainerClient(CONTAINER_NAME);

// Ensure container exists
(async () => {
  await containerClient.createIfNotExists();
})();

/* =========================
   ROUTES
========================= */

app.get("/health", (_, res) => {
  res.send("ok");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no file provided" });
    }

    const safeName = path.basename(req.file.originalname);
    const blobName = `${Date.now()}-${safeName}`;

    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    });

    res.status(201).json({
      container: CONTAINER_NAME,
      blob: blobName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload failed" });
  }
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, _, res, __) => {
  res.status(400).json({ error: err.message });
});

/* =========================
   START
========================= */

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

