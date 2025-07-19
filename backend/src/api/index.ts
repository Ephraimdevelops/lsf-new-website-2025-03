import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import emojis from "./emojis.js";
import team from "./team.js";
import hero from "./hero.js";
import testimonials from "./testimonials.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/team", team);
router.use("/hero", hero);
router.use("/testimonials", testimonials);

export default router;
