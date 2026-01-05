import dbOPS from "../dbOPS.ts";
export default class getUploaded {
  public dbOPS = new dbOPS();
  public async getNewlyUploadedVideos() {

    const columns = ['secure_url', 'users_id']
    const 
    const select = await this.dbOPS.select("videos");
  }
}
