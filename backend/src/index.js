import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello guys cosestash 🔥🔥");
});

app.use("/api/v1/auth", authRoutes);

app.listen(8080, () => {
  console.log("server is runnig on Port 8080");
});
