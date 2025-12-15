import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api", routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

