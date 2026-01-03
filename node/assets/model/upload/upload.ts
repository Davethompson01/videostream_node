import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";

// impport dbOPS
export default class uploadModel {
  public dbops = new dbOPS();
  public utils = new utilis();

  public async uploadVideo(users_id: string, public_id: string, secure_url: string) {
    const insert = await this.dbops.insert("images", {
      public_id,
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
      return await this.utils.returnData(false, "failed to send image", insert);
    }
    return await this.utils.returnData(true, "Successfully upload", insert);
  }
}
