import express from 'express';
import cors from 'cors';
import { GamesRoutes } from './routes/games.routes';

class Server {
  public main: any;

  constructor() {
    this.main = express();
    this.ApplySettings();
  }

  private ApplySettings() {
    const gamesRoutes: GamesRoutes = new GamesRoutes;

    this.main.use(cors());
    this.main.use('/', gamesRoutes.router)
  }


}

export default new Server().main