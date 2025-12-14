// routes/OAuthRoute.ts
import { Router } from "express";
import OAuthController from "../controller/auth/OAuth/googleAuth.ts";
// import OAuthController from "../controller/auth/OAuthController";

const router = Router();
const controller = new OAuthController();

router.get("/auth/google", (req, res) => controller.googleAuth(req, res));
router.get("/auth/google/callback", (req, res) =>
  controller.googleCallback(req, res)
);

export default router;
