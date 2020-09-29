export class Game {
  title: string = "";
  image_url: string = "";
  file_url: string = "";
  console: string = "";
  genre: string = "";
  sorted: number = 0;
  active: boolean = true;

  public static GetInstance(): Game {
    const instance: Game = new Game();

    return instance;
  }
}
