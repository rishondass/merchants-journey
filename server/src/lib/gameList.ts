import { type IGameDao} from "../dao"
import { IPlayer } from "../models/game";
const gameList:Record<string, {game: IGameDao}> = {}

export const addGame = (game:IGameDao)=>{
  gameList[game.gameID] = {game:game};
}


//TODO:Change to getGamesSimple 
export const getGames = ()=>{
  const base =  Object.values(gameList) ;
  const games:IGameDao[] = [];
  base.forEach(game => games.push(game.game));
  return games;
}

export const getGame = (gameID:string) =>{
  if(gameList[gameID]){
    return gameList[gameID].game;
  }else{
    return null;
  }
}

export const updateGame = (game:IGameDao)=>{
  gameList[game.gameID] = {game:game}
}

export const deleteGame = (gameID:string)=>{
  try{
    delete gameList[gameID];
    return true;
  }catch(e){
    return false;
  }
}

