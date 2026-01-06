import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";
import Database from "../../../config/database_connect.ts";

export default class viewModel {
  public dbops = new dbOPS();
  public utils = new utilis();
  public db_connection = new Database();

  public async getMostViewed(limit: number, offset: number) {
    const sql = `
    SELECT videos_id, secure_url, increment_count
    FROM trending
    ORDER BY increment_count DESC
    LIMIT ? OFFSET ?
  `;
    const db = await this.db_connection.connect();
    const [rows]: any = await db.query(sql, [limit, offset]);
    return this.utils.returnData(true, "Most viewed fetched", rows);
  }
}
