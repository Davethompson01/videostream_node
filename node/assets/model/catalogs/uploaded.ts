import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";
import Database from "../../../config/database_connect.ts";
export default class getUploaded {
  public utilis = new utilis();
  public dbOPS = new dbOPS();
  public database = new Database();

  public async getNewlyUploadedVideos(limit: number, offset: number) {
    const sql = `
    SELECT secure_url, users_id
    FROM videos
    WHERE visibility = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
    const db = await this.database.connect();
    const [rows]: any = await db.query(sql, ["public", limit, offset]);
    return this.utilis.returnData(true, "New uploads fetched", rows);
  }
}
