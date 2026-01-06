import utilis from "../utilis.ts";
import { Request, Response } from "express";
import getUploaded from "../../model/catalogs/uploaded.ts";
export default class getUploadedController {
  public utils = new utilis();
  public uploadedModel = new getUploaded();
  public async getnewlyUploaded(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const fetchVideos = await this.uploadedModel.getNewlyUploadedVideos(
      limit,
      offset
    );
    if (!fetchVideos.success) {
      return this.utils.sendResponse(
        res,
        401,
        false,
        fetchVideos.message,
        fetchVideos.data
      );
    }

    return this.utils.sendResponse(
      res,
      200,
      true,
      fetchVideos.message,
      fetchVideos.data
    );
  }
}
