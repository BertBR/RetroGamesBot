import express from "express";
import cors from "cors";
import { BaseRoutes } from "./routes/base.routes";
class Server {
  public main: any;

  constructor() {
    this.main = express();
    this.ApplySettings();
  }

  private ApplySettings() {
    const baseRoutes: BaseRoutes = new BaseRoutes();

    this.main.use(cors());
    this.main.use("/", baseRoutes.router);
  }
}

export default new Server().main;
