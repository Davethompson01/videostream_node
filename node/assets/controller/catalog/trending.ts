import utilis from "../utilis.ts";
import { Request, Response } from "express";
import trendingModel from "../../model/catalogs/trending.ts";

export default class trendingController {
  public utils = new utilis();
  public trendingModel = new trendingModel();

  public async addToIncrementTable(req: Request, res: Response) {
    // const insert =
    // const user req.use
    console.log("this is the req body", req.body);

    const { videos_id, secure_url, increment_count } = req.body;
    const insertModel = await this.trendingModel.updateIncrement(
      videos_id,
      increment_count,
      secure_url
    );
    if (!insertModel.success) {
      return this.utils.sendResponse(
        res,
        401,
        false,
        insertModel.message,
        insertModel.data
      );
    }

    return this.utils.sendResponse(
      res,
      200,
      true,
      insertModel.message,
      insertModel.data
    );
  }

  public async getTrendingVideos(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const result = await this.trendingModel.getTrendingVid(limit, offset);

    return this.utils.sendResponse(
      res,
      result.success ? 200 : 400,
      result.success,
      result.message,
      result.data
    );
  }

  public async getTrendingFeeds(req: Request, res : Response){
     const limit = Number(req.query.limit) || 10;
     const offset = Number(req.query.offset) || 0;

     
  }
}
