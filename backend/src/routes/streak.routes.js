import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCurrentStreak,
  getLongestStreak,
} from "../controllers/streak.controller.js";

const streakRoutes = express.Router();

streakRoutes.get("/current", authMiddleware, getCurrentStreak);
streakRoutes.get("/longest", authMiddleware, getLongestStreak);

export default streakRoutes;
