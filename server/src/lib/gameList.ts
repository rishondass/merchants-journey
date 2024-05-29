import { get } from "node:http";
import { type IGameDao} from "../dao"
import { IGame, IPlayer } from "../models/game";
const gameList:Map<string, {game: IGameDao} | null> = new Map();
import {client} from "../redis";


export const addGame = async(game:IGameDao)=>{
  // console.log(game);
  // gameList.set(game.gameID, {game:game});
  await client.set(`merchant_journey:${game.gameID}`, JSON.stringify(game));
  
  // await client.expire(`merchant_journey:${game.gameID}`,game.gameTime+30);
  console.log('creating game', game.gameID);
}


export const getGamesDetails = async()=>{
  const games:any[] = [];
  // gameList.forEach(game=>{
  //   games.push(
  //     {
  //       gameID: game?.game.gameID,
  //       gameTime: game?.game.gameTime,
  //       players: game?.game.players,
  //       maxPlayers: game?.game.maxPlayers,
  //       isActive: game?.game.isActive,
  //     }
  //   )
  // });

  const auxFn = async()=>{
    
  }

  const data = await client.keys("merchant_journey:*");
  for(let key of data){
      const game = await getGame(key.split(":")[1]);
      game&&games.push(
        {
          gameID: game.gameID,
          gameTime: game.gameTime,
          players: game.players,
          maxPlayers: game.maxPlayers,
          isActive: game.isActive,
        }
      )
    }
  
  
  return [...games];
}

export const getGameDetails = async(gameID:string)=>{
  // const game = gameList.get(gameID);
  const data = await client.get(`merchant_journey:${gameID}`);
  if(data){
    const game = JSON.parse(data);
    return {
      gameID: game.gameID,
      gameTime: game.gameTime,
      players: game.players,
      maxPlayers: game.maxPlayers,
      isActive: game.isActive,
    };
  }else{
    return null;
  }
}

export const getGame = async(gameID:string): Promise<IGame | null> =>{
  const game = await client.get(`merchant_journey:${gameID}`);
  if(game)
    return JSON.parse(game);
  else
    return null;
}

export const updateGame = async(game:IGame|null)=>{
  if(game)
    await client.set(`merchant_journey:${game.gameID}`,JSON.stringify(game));
  //gameList.set(game.gameID, {game});
}

export const deleteGame = async(gameID:string)=>{
  const key = `merchant_journey:${gameID}`;

  // Log the initial state of the key
  const initialCheck = await client.exists(key);
  console.log(`Initial existence check for ${key}: ${initialCheck}`);

  if (!initialCheck) {
    console.log(`Key ${key} does not exist`);
    return null;
  }

  // Get the current value of the key
  const game = await client.get(key);
  //console.log(`Current value for ${key}: ${game}`);

  // Delete the key
  const gameStatus = await client.del(key);
  console.log(`Delete status for ${key}: ${gameStatus}`);

  
  // Verify the key deletion
  const postDeleteCheck = await client.exists(key);
  console.log(`Post-deletion existence check for ${key}: ${postDeleteCheck}`);

  
  // Return the game data if it existed before deletion
  if (game) {
    return game;
  } else {
    return null;
  }
}

export const addPlayer = async(gameID:string,player: IPlayer) => {
  const game = await getGame(gameID);
  if(game)
    if(game.players.length === 0){
      player.gems = ['Y','Y','Y','','','','','','',''];
      game.players.push(player);
    }
    else if(game.players.length == 1){
      player.gems = ['Y','Y','Y','Y','','','','','',''];
      game.players.push(player);
    }
    else if(game.players.length == 2){
      player.gems = ['Y','Y','Y','Y','','','','','',''];
      game.players.push(player);
    }
    else if(game.players.length == 3){
      player.gems = ['Y','Y','Y','G','','','','','',''];
      game.players.push(player);
    }
    else if(game.players.length == 4){
      player.gems = ['Y','Y','Y','G','','','','','',''];
      game.players.push(player);
    }
    await updateGame(game);
}

export const removePlayer = async(gameID:string,playerID:string)=>{
  const game = await getGame(gameID);
  if(game)
  for(let i=0;i<game.players.length;i++){
    if(game.players[i].id === playerID){
      game.players.splice(i,1);
    }
  }

  await updateGame(game);
}

