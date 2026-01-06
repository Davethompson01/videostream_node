import utilis from "../../controller/utilis.ts";
import dbOPS from "../dbOPS.ts";

export default class UserModel {
  public Utilis = new utilis();
  public dbops = new dbOPS();

  public async checkMailExist(email: string) {
    const columns = ["email"];
    const condition = "email = ?";
    const param = [email];

    const checkMail = await this.dbops.select(
      "user",
      columns,
      condition,
      param,
      1,
      0
    );
    if (checkMail.data === 1) {
      return this.Utilis.returnData(
        true,
        "Email already exist",
        checkMail.data.insertId
      );
    }
  }

  public async getUserId(userID: string) {
    const columns = ["user_id"];
    const conditions = "user_id = ?";
    const param = [userID];

    const select = await this.dbops.select("users", columns, conditions, param);

    if (select.data === 1) {
      return this.Utilis.returnData(true, "user already exist", select);
    }

    return this.Utilis.returnData(false, "can't find user", select);
  }
}
