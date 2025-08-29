import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";
import { submitCode } from "../controllers/submit.controller.js";

const executionRoute = express.Router();

executionRoute.post("/", authMiddleware, executeCode);
executionRoute.post("/submit", authMiddleware, submitCode);
export default executionRoute;
