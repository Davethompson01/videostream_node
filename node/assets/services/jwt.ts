import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Utilis from '../controller/utilis.ts'
dotenv.config()

export default class jwtService{

    public utilis = new Utilis()
    public secret_key = process.env.SECRET_KEY!

    public async generateToken(payload: Record<string, any>): Promise<string> {
    // Convert to seconds
    const issuedAt = Math.floor(Date.now() / 1000)
    const expiresIn = issuedAt + 60 * 60 // 1 hour expiry

    const tokenPayload = {

      ...payload,
      iat: issuedAt,
      exp: expiresIn
    }

    const token = jwt.sign(tokenPayload, this.secret_key)
    return token
  }


  async generateRefreshToken(payload: object) {
    return jwt.sign(payload, this.secret_key, { expiresIn: "7d" });
  }

  public async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.secret_key);
      return this.utilis.returnData(true, 'Successfully decoded', decoded);
    } catch (err: any) {
      let message = 'Error while decoding token';

      if (err.name === 'TokenExpiredError') {
        message = 'Token has expired';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
      }

      return this.utilis.returnData(false, message, err.message);
    }
  }

}