import utilis from "../utilis.ts";
import { Request, Response } from "express";
import viewModels from "../../model/catalogs/viewed.ts";
// import trendingModel from "../../model/catalogs/trending.ts";

export default class viewController {
  public utils = new utilis();
  public viewModel = new viewModels();

  public async getTrendingVideos(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const result = await this.viewModel.getMostViewed(limit, offset);

    return this.utils.sendResponse(
      res,
      result.success ? 200 : 400,
      result.success,
      result.message,
      result.data
    );
  }
}
