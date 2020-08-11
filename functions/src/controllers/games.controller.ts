import {GamesDAO} from '../dataaccess/games.dao';
import {Request, Response} from 'express';

export class GameController {
  private dataAccess: GamesDAO = new GamesDAO();

  public createGame = async(req: Request, res: Response) => {
    const id = await this.dataAccess.create(req.body)
    res.status(201).json({id: id})
  }

  public listGames = async(req: Request, res: Response) => {
    const games = await this.dataAccess.listAll()
    res.json(games)
  }

}