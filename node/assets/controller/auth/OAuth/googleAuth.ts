// controller/auth/OAuthController.ts
import { Request, Response } from "express";

import axios from "axios";
import jwtService from "../../../services/jwt.ts";
import utilis from "../../utilis.ts";
import crypto, { randomUUID } from "crypto";
import UserModel from "../../../model/usersModel/usermodel.ts";
import googlesignIn from "../../../model/auth/OAuth/google/signin.ts";
import { log } from "console";

export default class OAuthController {
  protected checkMailExis = new UserModel();
  private jwt = new jwtService();
  private googleModel = new googlesignIn();
  protected utils = new utilis();
  // STEP 1: Redirect user to Google
  public async googleAuth(req: Request, res: Response) {
    const redirectUri = encodeURIComponent(
      "http://localhost:4000/gAuth/auth/google/callback"
    );

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&access_type=offline` +
      `&prompt=consent`;

    return res.redirect(url);
  }

  // STEP 2: Google redirects here WITH ?code=
  public async googleCallback(req: Request, res: Response) {
    const code = req.query.code as string;

    // VERY IMPORTANT CHECK
    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing",
      });
    }

    try {
      // Exchange code for tokens
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: "http://localhost:4000/gAuth/auth/google/callback",
          grant_type: "authorization_code",
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = tokenRes.data;

      // Fetch user info
      const userRes = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const googleUser = userRes.data;
      console.log(googleUser, access_token, tokenRes.data.refresh_token);

      // Save or find user
      const user_token = await this.utils.accessToken();
      // if(!user_token.data)

      // const refresh_token_jwt = this.jwt.generateRefreshToken({
      //   user_id: user.users_id,
      //   user_token: user_token.data,
      // });

      // const refreshToken = await this.jwt.generateRefreshToken();

      // const refreshHash = crypto
      //   .createHash("sha256")
      //   .update(refreshToken)
      //   .digest("hex");

      // await this.googleModel.createRefresh(user_id, refreshToken, refreshHash);
      //   user_id,
      //   token_id,
      //   token_hash: refreshHash,
      //   expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      // });

      const user = await this.googleModel.createAccount(
        googleUser.name,
        googleUser.email,
        googleUser.picture,
        user_token.data,
        tokenRes.data.refresh_token || "",
        "unknown",
        "google_user"
        // tokenRes.data.expires_in
      );

      const user_id = await user.data.user_id;
      console.log("this is the user_id", user_id);

      const refreshToken = await this.jwt.generateRefreshToken({
        user_id: user.data.user_id,
        user_type: "google_user",
        token_id: crypto.randomUUID(),
      });

      // console.log()

      const refreshHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await this.googleModel.createRefresh(user_id, refreshHash);

      // Generate JWT for frontend
      const token = await this.jwt.generateToken({
        user_id,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: "google",
        user_type: "google_user",
      });

      console.log(token, " this is the refresh token for users", refreshToken);

      return this.utils.sendResponse(res, 201, true, "Account created", {
        jwt: token,
        accessToken: refreshToken,
      });
      // return res.redirect(`http://localhost:3000/oauth-success`);
    } catch (error: any) {
      console.error("Google OAuth error:", error.response?.data || error);
      return res.status(500).json({
        error: "Google OAuth failed",
      });
    }
  }



  public async logoutuser(){
    
  }
}
