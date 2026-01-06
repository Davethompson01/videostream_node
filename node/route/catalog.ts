import { Router } from "express";
import apiKey from "../assets/middleware/apiKeyMiddleware.ts";
// import auth
import catalogController from "../assets/controller/catalog/catalog.ts";
import getUploadedController from "../assets/controller/catalog/uploaded.ts";
import trendingController from "../assets/controller/catalog/trending.ts";
import viewController from "../assets/controller/catalog/viewed.ts";
const router = Router();
const uploaded = new getUploadedController();
const controller = new trendingController();
const view = new viewController();
const catalog = new catalogController()

router.post("/api/incrementvideo", async (req, res) =>
  controller.addToIncrementTable(req, res)
);

router.get("/trendingvideos", async (req, res) =>
  controller.getTrendingVideos(req, res)
);

router.get("/newlyuploaded", async (req, res) =>
  uploaded.getnewlyUploaded(req, res)
);

router.get("/mostviewed", async (req, res) => view.getTrendingVideos(req, res));


router.get("/getcatalogfeed", async (req,res) => catalog.getCatalogFeed(req,res))
export default router;
