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
    user_type: string
    // token_expire_date: string
  ) {
    try {
      const mailExist = await this.usermodel.checkMailExist(email);
      if (mailExist) {
        console.log("Mail exists:", mailExist);
        return await this.Utilis.returnData(
          true,
          "Account Found",
          mailExist.data
        );
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
        // token_expire_date,
      });

      console.log("Insert result:", create);

      if (!create.success) {
        console.log("Insert failed:", create.data);
        return this.Utilis.returnData(
          false,
          "Failed to create account",
          create
        );
      }

      return this.Utilis.returnData(true, "Account created", {
        user_id: create.data.insertId,
      });
    } catch (err) {
      console.error("CreateAccount error:", err);
      return this.Utilis.returnData(false, "Unexpected error", err);
    }
  }

  public async createRefresh(user_id: number, token_hash: string) {
    const insert = await this.dbops.insert("refresh_tokens", {
      user_id,
      token_hash,
      revoked: false,
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    });

    if (!insert.success) {
      console.log("Insert failed:", insert.data);
      return this.Utilis.returnData(false, "Failed to create account", []);
    }

    return this.Utilis.returnData(
      true,
      "refresh token created",
      insert.data.insertId
    );
  }
}
