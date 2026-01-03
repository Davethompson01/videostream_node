import { Router } from "express";
import apiKey from "../assets/middleware/apiKeyMiddleware.ts";
import upload from "../assets/controller/upload/upload.ts";
import authenicate from "../assets/middleware/authenicationMiddleWare.ts";
import authorisationMiddleWare from "../assets/middleware/authorisation.ts";
import multer from "multer";

const router = Router();
const controller = new upload();
const multerDIR = multer({dest: "uploads"})

router.get("/api/generateSignUrl", apiKey, authenicate, (req, res) =>
  controller.generateSignedUrl(req, res)
);

router.post(
  "/api/getImageMeta",
  apiKey,
  authenicate,
  authorisationMiddleWare("google_user"),
  (req, res) => controller.getImageMeta(req, res)
);

router.post(
  "/api/uploadImage",
  apiKey,
  authenicate,
  authorisationMiddleWare("google_user"),
  multerDIR.single("image"),
  (req, res) => controller.uploadImage(req, res)
);

export default router;
