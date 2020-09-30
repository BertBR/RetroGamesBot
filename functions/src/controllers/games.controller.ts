import { GamesDAO } from "../dataaccess/games.dao";
import { Request, Response } from "express";
import { config } from "../bot";

export class GameController {
  private dataAccess: GamesDAO = new GamesDAO();

  public createGame = async (req: Request, res: Response) => {
    if (req.headers.authorization === config.api.token) {
      const id = await this.dataAccess.create(req.body);
      return res.status(201).json({ id: id });
    }

    return res.status(403).send("Not Authorized!");
  };

  public listGames = async (req: Request, res: Response) => {
    if (req.headers.authorization === config.api.token) {
      const games = await this.dataAccess.listAll();
      return res.json(games);
    }
    return res.status(403).send("Not Authorized!");
  };

  public botCommands = async (req: Request, res: Response) => {
    if (req.body.inline_query) {
      return res.send(await this.dataAccess.api(req.body.inline_query));
    }

    if (!req.body.message) {
      return res.send();
    }

    if (req.body.message.text === "/count@retrogamesbr_bot") {
      return res.send(await this.dataAccess.countGames(req.body.message));
    }

    if (req.body.message.text === "/games@retrogamesbr_bot") {
      return res.send(
        await this.dataAccess.topGames(req.body.message, "games")
      );
    }

    if (req.body.message.text === "/consoles@retrogamesbr_bot") {
      return res.send(
        await this.dataAccess.topConsoles(req.body.message, "consoles")
      );
    }

    if (req.body.message.text === "/genres@retrogamesbr_bot") {
      return res.send(
        await this.dataAccess.topGenres(req.body.message, "genres")
      );
    }

    return res.send();
  };
}
