import express from "express";
import { GameController } from "../controllers/games.controller";

export class BaseRoutes {
  private gameControler: GameController = new GameController();
  public router = express.Router();
  public app = express();

  constructor() {
    this.buildRoutes();
  }

  private buildRoutes() {
    this.router.post("/games", this.gameControler.createGame);
    this.router.get("/games", this.gameControler.listGames);
    this.router.post("/bot", this.gameControler.botCommands);
    this.router.get("/tmp", this.gameControler.dontRequestMe);
  }
}
