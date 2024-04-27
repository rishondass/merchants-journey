import { type IGameDao} from "../dao"
const gameList:Record<string, {game: IGameDao}> = {}

export const addGame = (game:IGameDao)=>{
  gameList[game.gameID] = {game:game};
}

export const getGames = ()=>{
  const base =  Object.values(gameList) ;
  const games:IGameDao[] = [];
  base.forEach(game => games.push(game.game));
  return games;
}