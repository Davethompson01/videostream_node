// controller/auth/OAuthController.ts
import { Request, Response } from "express";
import axios from "axios";
import jwtService from "../../../services/jwt.ts";
import googlesignIn from "../../../model/auth/OAuth/google/signin.ts";

export default class OAuthController {
  private jwt = new jwtService();
  private googleModel = new googlesignIn();

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

    // 🔴 VERY IMPORTANT CHECK
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
      await this.googleModel.createAccount(
        googleUser.name,
        googleUser.email,
        googleUser.picture,
        access_token,
        tokenRes.data.refresh_token || "",
        "unknown",
        "google_user",
        tokenRes.data.expires_in
      );
      

      // Generate JWT for frontend
      const token = await this.jwt.generateToken({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: "google",
      });

      // Redirect to frontend
      return res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
    } catch (error: any) {
      console.error("Google OAuth error:", error.response?.data || error);
      return res.status(500).json({
        error: "Google OAuth failed",
      });
    }
  }
}
