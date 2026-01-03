import { Router } from "express";
import apiKey from "../assets/middleware/apiKeyMiddleware.ts";
import OAuthController from "../assets/controller/auth/OAuth/googleAuth.ts";
// import OAuthController from ".÷controller/auth/OAuth/googleAuth.ts";
// import OAuthController from "../controller/auth/OAuthController";

const router = Router();
const controller = new OAuthController();

router.get("/auth/google", async (req, res) => controller.googleAuth(req, res));
router.get("/auth/google/callback", async (req, res) =>
  controller.googleCallback(req, res)
);

export default router;
