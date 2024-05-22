import { type IGameDao} from "../dao"
import { IGame, IPlayer } from "../models/game";
const gameList:Map<string, {game: IGameDao}> = new Map();

export const addGame = (game:IGameDao)=>{
  gameList.set(game.gameID, {game:game});
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
  const game = gameList.get(gameID);
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
  const game = gameList.get(gameID)
  if(game){
    return game.game;
  }else{
    return null;
  }
}

export const updateGame = (game:IGameDao)=>{
  gameList.set(game.gameID, {game});
  return gameList.get(game.gameID);
}

export const deleteGame = (gameID:string)=>{
  try{
    console.log(gameID);
    const game = gameList.get(gameID);
    gameList.delete(gameID);
    if(game)
      return game.game;
    else
      return null;
  }catch(e){
    return null;
  }
}

