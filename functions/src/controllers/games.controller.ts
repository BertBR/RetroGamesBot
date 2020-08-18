import { GamesDAO } from '../dataaccess/games.dao';
import { Request, Response } from 'express';

export class GameController {
  private dataAccess: GamesDAO = new GamesDAO();

  public createGame = async (req: Request, res: Response) => {
    const id = await this.dataAccess.create(req.body)
    res.status(201).json({ id: id })
  }

  public listGames = async (req: Request, res: Response) => {
    const games = await this.dataAccess.listAll()
    res.json(games)
  }

  public botCommands = async (req: Request, res: Response) => {
    if (req.body.message.text === '/count@retrogamesbr_bot') {
      res.send(await this.dataAccess.countGames(req.body.message.from.id));
    }

    if (req.body.message.text === '/games@retrogamesbr_bot') {
      res.send(await this.dataAccess.topGames(req.body.message, 'games'));
    }

    if (req.body.message.text === '/consoles@retrogamesbr_bot') {
      res.send(await this.dataAccess.topConsoles(req.body.message, 'consoles'));
    }

    if (req.body.message.text === '/genres@retrogamesbr_bot') {
      res.send(await this.dataAccess.topGenres(req.body.message, 'genres'));
    }
    
    res.send();
  }

}