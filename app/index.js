import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const app = express();

/* =========================
   PATH SETUP (ES MODULES)
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   ENV / CONFIG
========================= */

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is not set");
}

const PORT = process.env.PORT || 8080;
const ACCOUNT_NAME = "aiimgupl87343";
const CONTAINER_NAME = "images";

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HEALTH CHECK (NO AUTH)
========================= */

app.get("/health", (_, res) => {
  res.status(200).send("ok");
});

/* =========================
   FRONTEND CONFIG (API KEY)
========================= */

app.get("/config.js", (_, res) => {
  res.type("application/javascript");
  res.send(`
    window.APP_CONFIG = {
      API_KEY: "${API_KEY}"
    };
  `);
});

/* =========================
   SECURITY (API KEY)
========================= */

app.use((req, res, next) => {
  if (req.path === "/health" || req.path === "/config.js") {
    return next();
  }

  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  next();
});

/* =========================
   RATE LIMITING
========================= */

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
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
   AZURE STORAGE (MANAGED IDENTITY)
========================= */

const isAzure =
  !!process.env.MSI_ENDPOINT ||
  !!process.env.AZURE_CLIENT_ID;

let containerClient = null;

if (isAzure) {
  console.log("Running in Azure with Managed Identity");

  const credential = new DefaultAzureCredential();

  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net`,
    credential
  );

  containerClient =
    blobServiceClient.getContainerClient(CONTAINER_NAME);
} else {
  console.log("Running locally – Azure Blob disabled");
}

/* =========================
   ROUTES
========================= */

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!containerClient) {
      return res.status(503).json({
        error: "storage not configured",
      });
    }

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
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

