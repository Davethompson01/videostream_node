
import Utilis from "../utilis.ts";
import { Request, Response } from "express";
import UserModel from "../../model/usersModel/usermodel.ts";
import googlesignIn from "../../model/auth/OAuth/google/signin.ts";
import jwtService from "../../services/jwt.ts";

export default class AuthController{

    public utilis = new Utilis()
    public usermodel = new UserModel()
    public jwt  = new jwtService()
    public googleSignin = new googlesignIn()

    public async createAccount(req: Request, res : Response){

        const {username,email, user_token, avatar, jwt_token, user_type, access_token, refresh_token, location, token_expire_date} = req.body
        
        // check username Pattern
        const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{4,20}$/;
            if (!usernamePattern.test(username))
                return this.utilis.sendResponse(res, 200, false, "Invalid username format", null);

            if (username.length < 3)
            return this.utilis.sendResponse(res, 200, false, "Username too short", null);

            // check if mail exist, function already in the user model
            const checkMail = await this.usermodel.checkMailExist(email)

            if(checkMail){
                return this.utilis.sendResponse(res, 200, false, "Email already exist",[])
            }

            // generate unique for user
            const generateToken = await this.utilis.generateAlphaNumeric(10)
            if(!generateToken){
                return this.utilis.sendResponse(res, 200, false, "Failed to create users_id",[])
            }

            // extract usertoken from the generate function
            const USERTOKEN = await generateToken.data

            const allowedTypes = ['users', 'superAdmin', 'Admin']
            if(!allowedTypes.includes(user_type)){
                return this.utilis.sendResponse(res, 200, false, "Not a valid user",[])
            }

            // insert into the model db
            const insert = await this.googleSignin.createAccount(username,email, user_token, avatar, jwt_token, user_type, access_token, refresh_token)
            if(!insert){
                return this.utilis.sendResponse(res, 400, false, 'Failed to create users' , [])
            }

            const jwt = this.jwt.generateToken({username,email, user_token, avatar, user_type, access_token, refresh_token, location})
            
    }
}