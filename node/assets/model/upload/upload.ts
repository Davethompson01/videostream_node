import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";

// impport dbOPS
export default class uploadModel {
  public dbops = new dbOPS();
  public utils = new utilis();

  public async uploadVideo(
    users_id: string,
    public_url: string,
    secure_url: string
  ) {
    const insert = await this.dbops.insert("videos", {
      users_id,
      public_url,
      secure_url,
    });
    if (!insert.success) {
      return this.utils.returnData(
        false,
        "an error occured while inserting",
        insert
      );
    }
    return this.utils.returnData(true, "Insert successful", insert);
  }

  public async uploadImages(
    users_id: number,
    public_url: string,
    secure_url: string
  ) {
    const insert = await this.dbops.insert("images", {
      users_id,
      public_url,
      secure_url,
    });

    if (!insert.success) {
      return this.utils.returnData(false, "failed to send image", insert);
    }
    return this.utils.returnData(true, "Successfully upload", insert);
  }

  public async getUsersImage(
    users_id: string
    // public_url: string,
    // secure_url: string
  ) {
    const column = ["secure_url"];
    // const params =
    const condition = "users_id = ?";
    const select = await this.dbops.select("images", column, condition, [
      users_id,
    ]);

    if (!select.success) {
      return this.utils.returnData(false, select.message, select.data);
    }
    return this.utils.returnData(true, "user found", select.data);
  }

  public async getUsersVideos(
    users_id: string
    // public_url: string,
    // secure_url: string
  ) {
    const column = ["secure_url"];
    // const params =
    const condition = "users_id = ?";
    const select = await this.dbops.select("videos", column, condition, [
      users_id,
    ]);

    if (!select.success) {
      return this.utils.returnData(false, select.message, select.data);
    }
    return this.utils.returnData(true, "user found", select.data);
  }
}
