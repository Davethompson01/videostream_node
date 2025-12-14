import { Request, Response } from "express";
// import dbOPS from "../../../dbOPS";
// import dbOPS from "../dbOPS";
import dbOPS from "../../../dbOPS.ts";
import utilis from "../../../../controller/utilis.ts";
import UserModel from "../../../usersModel/usermodel.ts";

export default class googlesignIn {
  public dbops = new dbOPS();
  public Utilis = new utilis();
  public usermodel = new UserModel();

  // public async checkMail

  public async createAccount(
    username: string,
    email: string,
    avatar: string,
    access_token: string,
    refresh_token: string,
    location: string,
    user_type: string,
    token_expire_date: string
  ) {
    const mailExist = await this.usermodel.checkMailExist(email);
    if (mailExist) {
      console.log("Mail exist check:", mailExist);
      return this.Utilis.returnData(true, "Account Found", mailExist);
    }

    const create = await this.dbops.insert("users", {
      provider: "google",
      username,
      email,
      avatar,
      access_token,
      refresh_token,
      location,
      user_type,
      
    });
    console.log("Insert result:", create);

    if (!create.success) {
      console.log("insert result", create.data);

      return this.Utilis.returnData(false, "Failed to create account", create);
    }

    return this.Utilis.returnData(true, "Account created", create);
  }
}
