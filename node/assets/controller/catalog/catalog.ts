import utilis from "../utilis.ts";
import { Request, Response } from "express";
import trendingModel from "../../model/catalogs/trending.ts";
// import trendingController from "./trending.ts";
// import upload from "../upload/upload.ts";
import getUploaded from "../../model/catalogs/uploaded.ts";
// import viewController from "./viewed.ts";
import viewModel from "../../model/catalogs/viewed.ts";
import { responseEncoding } from "axios";
export default class catalogController {
  public utils = new utilis();
  public trending = new trendingModel();
  public upload = new getUploaded();
  public view = new viewModel();

  public async getCatalogFeed(req: Request, res: Response) {
    console.log("Catalog hit", req.query);

    const limit = Number(req.query.limit) || 15;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // feed distribution
    const recentLimit = Math.ceil(limit * 0.4); // 40%
    const trendingLimit = Math.ceil(limit * 0.4); // 40%
    const popularLimit = limit - recentLimit - trendingLimit; // 20%

    // fetch feeds in parallel
    const [recent, trending, popular] = await Promise.all([
      this.upload.getNewlyUploadedVideos(recentLimit, offset),
      this.trending.getTrendingVid(trendingLimit, offset),
      this.view.getMostViewed(popularLimit, offset),
    ]);

    // merge all arrays safely
    const combined = [
      ...(recent?.data || []),
      ...(trending?.data || []),
      ...(popular?.data || []),
    ];

    console.log("Combined feed:", combined);
    console.log("Is array?", Array.isArray(combined));

    // shuffle combined feed
    const shuffled = this.utils.shuffle(combined);

    console.log("Combined feed length:", combined.length);
    console.log("Shuffled feed sample:", shuffled.slice(0, 3));

    // send fully resolved array to Postman
    return this.utils.sendResponse(res, 200, true, "Catalog feed", shuffled);
  }
}
