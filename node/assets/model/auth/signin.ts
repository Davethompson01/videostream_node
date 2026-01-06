import { Request, Response } from "express";
// import dbOPS from "../../../dbOPS";
import dbOPS from "../dbOPS.ts";
import utilis from "../../controller/utilis.ts";
import UserModel from "../usersModel/usermodel.ts";

export default class googlesignIn {
  public dbops = new dbOPS();
  public Utilis = new utilis();
  public usermodel = new UserModel();

  // public async checkMail

  public async createAccount(
    username: string,
    email: string,
    user_token: String,
    avatar: string,
    jwt_token: string,
    user_type: string,
    access_token: string,
    refresh_token: string,
    location: string,
    token_expire_date: string
  ) {
    // check if mail exist
    const mailExist = await this.usermodel.checkMailExist(email);
    if (mailExist) {
      return this.Utilis.returnData(false, "Account Found", []);
    }

    // create users if no user is found
    const create = await this.dbops.insert("users", {
      username,
      email,
      user_token,
      avatar,
      jwt_token,
      user_type,
      access_token,
      refresh_token,
      location,
      token_expire_date,
    });

    // always check if reponse failed - 1st
    if (!create) {
      return  this.Utilis.returnData(false, "Failed to create account", []);
    }
    return  this.Utilis.returnData(true, "Account succesfully created", create);
  }


  
}
