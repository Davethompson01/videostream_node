import express from "express";
import cors from "cors";
import OAuthRoute from "./assets/route/OAuth.ts";
import apiKey from "./assets/middleware/apiKeyMiddleware.ts";
import { corsOption } from "./assets/services/headers.ts";
// import
// import { log } from 'node:console'

const app = express();

app.use(express.json());
app.use(cors(corsOption));
const PORT = process.env.PORT;
// const verifyApiKey = new apiKey();

// routes
app.use("/gAuth", OAuthRoute);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
