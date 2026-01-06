import express from "express";
import cors from "cors";
import OAuthRoute from "./route/OAuth.ts";
import catalogRoute from "./route/catalog.ts";
import apiKey from "./assets/middleware/apiKeyMiddleware.ts";
import upload from "./route/upload.ts";
import { corsOption } from "./assets/services/headers.ts";
// import authenicate from "./assets/middleware/authenicationMiddleWare.ts";
// import authorisationMiddleWare from "./assets/middleware/authorisation.ts";
// import
// import { log } from 'node:console'

const app = express();

app.use(express.json());
app.use(cors(corsOption));
const PORT = process.env.PORT;
// const verifyApiKey = new apiKey();
// console.log(process.env.CLOUDINARY_API_KEY); // should NOT be undefined

// routes login
app.use("/gAuth", OAuthRoute);

// upload route
app.use("/upload", upload);

// catalog route
app.use("/catalog", catalogRoute);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
