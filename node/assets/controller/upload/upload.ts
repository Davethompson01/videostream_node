import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { Response, Request, NextFunction } from "express";
import jwtService from "../../services/jwt.ts";
import utilis from "../utilis.ts";
import fs from "fs";
// import testimage from "../../../image/testimage.png"
import uploadModel from "../../model/upload/upload.ts";

// import cloudinary from "cloudinary";
import cloudinary from "../../../config/cloudinary.config.ts";
// import dotenv from 'dotenv'

export default class upload {
  public cloudinary = cloudinary.v2;
  public utils = new utilis();
  public jwt = new jwtService();
  public upload = new uploadModel();

  public async generateSignedUrl(req: Request, res: Response) {
    // const { token } = req.params;
    // const verifyToken = await this.jwt.verifyToken(token);
    // if (!verifyToken.success) {
    //   return this.utils.returnData(false, "Failed decoded", null);
    // }
    const timeStamp = Math.round(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timeStamp}${process.env.CLOUDINARY_URL}`)
      .digest("hex");

    const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
    const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;

    const tokenPayload = {
      timeStamp,
      signature,
      CLOUDINARY_NAME,
      CLOUDINARY_KEY,
    };
    return this.utils.sendResponse(res, 200, true, "Succesful", tokenPayload);
  }

  // public async getImageMeta(req: Request, res: Response) {
  //   const { users_id, public_id, secure_url } = req.body;

  //   if (!public_id || !secure_url) {
  //     return this.utils.sendResponse(res, 200, false, "Invalid Response", null);
  //   }

  //   const inserModel = await this.upload.uploadVideo(
  //     users_id,
  //     public_id,
  //     secure_url
  //   );
  //   if (!inserModel.success) {
  //     return this.utils.sendResponse(res, 200, false, "Video failed to upload");
  //   }
  //   return this.utils.sendResponse(
  //     res,
  //     201,
  //     true,
  //     "Video successfully uploaded"
  //   );
  // }

  public async uploadImage(req: Request, res: Response) {
    try {
      console.log(req.user);
      if (!req.user?.user_id) {
        return this.utils.sendResponse(
          res,
          401,
          false,
          "Unauthorized: user not authenticated"
        );
      }
      if (!req.file) {
        return this.utils.sendResponse(res, 200, false, "No file uploaded");
      }

      // if(!req.){

      // }

      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "my_images",
        resource_type: "image",
      });

      // Save ONLY metadata to DB
      const user_id = req.user.user_id;
      const saved = await this.upload.uploadImages(
        user_id,
        result.public_id,
        result.secure_url
      );

      if (!saved.success) {
        return this.utils.sendResponse(
          res,
          200,
          false,
          "Failed to save image meta"
        );
      }

      // Clean up local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return this.utils.sendResponse(res, 201, true, "Image uploaded", {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      });
    } catch (error: any) {
      return this.utils.sendResponse(
        res,
        500,
        false,
        error.message,
        error.data
      );
    }
  }

  public async getUsersImage(req: Request, res: Response) {
    const users_id = req.user.user_id;
    console.log(users_id);

    if (!users_id) {
      return this.utils.sendResponse(res, 401, false, "invalid request", []);
    }

    const getUsersImages = await this.upload.getUsersImage(users_id);
    if (!getUsersImages.success) {
      return this.utils.sendResponse(
        res,
        401,
        false,
        getUsersImages.message,
        getUsersImages.data
      );
    }
    return this.utils.sendResponse(
      res,
      200,
      true,
      getUsersImages.message,
      getUsersImages.data
    );

    // next();
  }

  public async uploadVideo(req: Request, res: Response) {
    try {
      console.log(req.user);
      if (!req.user?.user_id) {
        return this.utils.sendResponse(
          res,
          401,
          false,
          "Unauthorized: user not authenticated"
        );
      }
      if (!req.file) {
        return this.utils.sendResponse(res, 200, false, "No file uploaded");
      }

      // upload video to cloudinary
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "my_videos",
        transformation: [{ width: 720, crop: "scale" }, { format: "mp4" }],
      });

      // save meta into dbd
      const user_id = req.user.user_id;

      const saved = await this.upload.uploadVideo(
        user_id,
        upload.public_id,
        upload.secure_url
      );

      if (!saved.success) {
        return this.utils.sendResponse(
          res,
          200,
          false,
          "Failed to save image meta"
        );
      }

      // Clean up local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return this.utils.sendResponse(res, 201, true, "Image uploaded", {
        public_id: upload.public_id,
        secure_url: upload.secure_url,
        format: upload.format,
        bytes: upload.bytes,
        width: upload.width,
        height: upload.height,
      });
    } catch (error: any) {
      return error.message;
    }
  }

  public async getUsersVideos(req: Request, res: Response) {
    const users_id = req.user.user_id;
    console.log(users_id);

    if (!users_id) {
      return this.utils.sendResponse(res, 401, false, "invalid request", []);
    }

    const getUsersImages = await this.upload.getUsersVideos(users_id);
    if (!getUsersImages.success) {
      return this.utils.sendResponse(
        res,
        401,
        false,
        getUsersImages.message,
        getUsersImages.data
      );
    }
    return this.utils.sendResponse(
      res,
      200,
      true,
      getUsersImages.message,
      getUsersImages.data
    );

    // next();
  }
}
