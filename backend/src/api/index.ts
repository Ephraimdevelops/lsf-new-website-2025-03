import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import hero from "../routes/hero.js";
import paralegals from "../routes/paralegals.js";
import team from "../routes/team.js";
import testimonials from "../routes/testimonials.js";
import auth from "../routes/auth.js";
import admin from "../routes/admin.js";
import emojis from "./emojis.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/emojis", emojis);
router.use("/team", team);
router.use("/hero", hero);
router.use("/testimonials", testimonials);
router.use("/paralegals", paralegals);

export default router;
