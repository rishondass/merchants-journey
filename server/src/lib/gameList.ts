import { type IGameDao} from "../dao"
import { IGame, IPlayer } from "../models/game";
const gameList:Record<string, {game: IGameDao}> = {}

export const addGame = (game:IGameDao)=>{
  gameList[game.gameID] = {game:game};
}


export const getGamesDetails = ()=>{
  const base =  Object.values(gameList) ;
  const games:any[] = [];
  base.forEach(game => games.push(
    {
      gameID: game.game.gameID,
      gameTime: game.game.gameTime,
      players: game.game.players,
      maxPlayers: game.game.maxPlayers,
      isActive: game.game.isActive,
    }
  ));
  return games;
}

export const getGameDetails = (gameID:string)=>{
  const game = gameList[gameID];
  if(game){
    return {
      gameID: game.game.gameID,
      gameTime: game.game.gameTime,
      players: game.game.players,
      maxPlayers: game.game.maxPlayers,
      isActive: game.game.isActive,
    };
  }else{
    return null;
  }
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
  return gameList[game.gameID].game;
}

export const deleteGame = (gameID:string)=>{
  try{
    const game = gameList[gameID]
    delete gameList[gameID];
    return game.game;
  }catch(e){
    return null;
  }
}

