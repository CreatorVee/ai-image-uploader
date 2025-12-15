import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), (req, res) => {
  // TODO: call Azure AI Vision API here

  res.json({
    editedImageUrl: "https://via.placeholder.com/300", // TEMP
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));

