import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
// import expressJwt from 'express-jwt';

import { config } from "../../config";

export default async (app: express.Application) => {
  // Body parser only needed during POST on the graphQL path
  app.use(config.graphqlPath, bodyParser.json());

  // Cors configuration
  app.use(cors());

  // Sets various HTTP headers to help protect our app
  app.use(helmet());

  // app.use(
  //   expressJwt({
  //     secret: "f1BtnWgD3VKY",
  //     algorithms: ["HS256"],
  //     credentialsRequired: false
  //   })
  // );
};
