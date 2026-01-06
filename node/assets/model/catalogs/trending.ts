import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";
import Database from "../../../config/database_connect.ts";

export default class trendingModel {
  public dbops = new dbOPS();
  public utils = new utilis();
  public db_connection = new Database();

  public async addIncrementTable(
    // users_id: number,
    videos_id: number,
    secure_url: string,
    increment_count: number
  ) {
    const insert = await this.dbops.insert("trending", {
      //   users_id,
      videos_id,
      secure_url,
      increment_count,
    });

    if (!insert.success) {
      return this.utils.returnData(false, insert.message, insert.data);
    }
    return this.utils.returnData(true, insert.message, insert.data);
  }

  public async updateIncrement(
    video_id: number,
    increment_count: number,
    secure_url: string
  ) {
    const column = ["videos_id"];
    const condition = "videos_id = ?";
    const param = [video_id];
    const check = await this.dbops.select("trending", column, condition, param);

    if (!check.success) {
      return this.utils.returnData(false, check.message, check.data);
    }
    // does not exist

    if (check.data.length === 0) {
      return this.addIncrementTable(video_id, secure_url, increment_count);
    }

    const sql = `
  UPDATE trending
  SET increment_count = increment_count + ?
  WHERE videos_id = ?
`;

    const db = await this.db_connection.connect();
    const [result]: any = await db.query(sql, [increment_count, video_id]);
    await db.commit();

    if (result.affectedRows > 0) {
      return this.utils.returnData(true, "Update successful", {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      });
    }
    return this.utils.returnData(false, "No rows were updated", result);

    // await db
  }

  public async getCurrentCount(videos_id: number) {
    const column = ["increment_count"];
    const condition = "videos_id = ?";
    const param = [videos_id];
    const select = await this.dbops.select(
      "trending",
      column,
      condition,
      param
    );

    if (!select.success) {
      return this.utils.returnData(false, "fetch failed", select.data);
    }

    return this.utils.returnData(
      true,
      "successfully fetched exist",
      select.data
    );
  }

  public async getTrendingVid(limit: number, offset: number) {
    const sql = `
    SELECT videos_id, secure_url, increment_count
    FROM trending
    ORDER BY increment_count DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;
    const db = await this.db_connection.connect();
    const [rows]: any = await db.query(sql, [limit, offset]);
    return this.utils.returnData(true, "Trending videos fetched", rows);
  }
}
