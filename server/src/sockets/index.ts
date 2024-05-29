import {type Socket} from 'socket.io';
import { GameDao, IGameDao, PlayerDao } from "../dao";
import {getPlayer,getAllPlayers,removePlayerFromServer, addGameToPlayer, removeGameFromPlayer} from '../lib/playerList';
import {addGame as addGameObj, getGamesDetails,getGameDetails, getGame, updateGame, deleteGame, addPlayer, removePlayer} from "../lib/gameList";
import {io} from "../index"


const connection = (socket: Socket) => {
	//console.log(socket.data.user);
  //console.log(playerList)
  socket.on('disconnect',()=>{
  })

  socket.on('logOff', ()=>{
    removePlayerFromServer(socket.data.user.id);
  })

  if(socket.data.user)
    socket.emit("authToken",socket.data.user.id,socket.data.user.auth.username,socket.data.user.gameID, socket.data.user.auth.token, socket.data.user.auth.expires);
	
  /**
   * Games Sockets
   */

  socket.on('createGame',async(game,cb)=>{
    const gameObj = new GameDao(game.players,game.time);
    await addGameObj(gameObj);
    await addPlayer(gameObj.gameID,new PlayerDao(socket.data.user.id,socket.data.user.auth.username));
    addGameToPlayer(socket.data.user.id, gameObj.gameID);
    //socket.data.user.gameID = gameObj.gameID;
    const gameFinal = await getGame(gameObj.gameID);
    io.emit('updateLobby','CREATE', gameFinal);
    socket.join(gameObj.gameID);
    cb(gameObj.gameID)
  })

  socket.on('deleteGame',async(gameID:string,cb)=>{
    const game = await deleteGame(gameID);
    if(game){
      socket.leave(gameID);
      io.to(gameID).emit('gameClose');
      io.emit('updateLobby','DELETE', game);
      cb({status:200,msg:"success"})
    }else{
      cb({status:500, msg: "couldn't delete game"})
    }
  })

  
  socket.on('getGames',async(cb)=>{
    const games = await getGamesDetails();
    cb(games);
  })

  socket.on('getGame',async(gameID, cb)=>{
    
    const game = await getGame(gameID);
    if(game){
      cb(game);
    }else{
      cb(null)
    }
  })

  socket.on('getGameDetails',async(gameID, cb)=>{
    
    const game = await getGameDetails(gameID);
    if(game){
      cb(game);
    }else{
      cb(null)
    }
  })

  socket.on('joinGame',async(gameID:string,cb)=>{
    const game = await getGame(gameID);
    if(game){
      if(game.players.length < game.maxPlayers){
        socket.join(game.gameID);
        await addPlayer(game.gameID,new PlayerDao(socket.data.user.id,socket.data.user.auth.username))
        addGameToPlayer(socket.data.user.id, game.gameID);
        socket.data.user.gameID = game.gameID;
        const newGame = await getGame(game.gameID);
        newGame&&io.emit('updateLobby','UPDATE', {
          gameID:newGame.gameID,
          gameTime:newGame.gameTime,
          players:newGame.players,
          maxPlayers:newGame.maxPlayers,
          isActive:newGame.isActive,
        });
        newGame&&io.to(game.gameID).emit('updateGameDetails',{
          gameID: newGame.gameID,
          gameTime: newGame.gameTime,
          players: newGame.players,
          maxPlayers: newGame.maxPlayers,
          isActive: newGame.isActive,
        });
        cb({code:200, msg:"successfully joined"})
      }else{
        cb({code:400, msg:"game is already full"})
      }
      
    }else{
      cb({code:404, msg:"game doesn't exist"})
    }
  })

  socket.on('leaveGame',async(gameID:string, cb)=>{
    const game = await getGame(gameID);
    if(game){
      socket.leave(gameID);
      await removePlayer(gameID,socket.data.user.id);
      removeGameFromPlayer(socket.data.user.id);
      socket.data.user.gameID = "";
      const newGame = await getGame(game.gameID);
      newGame&&io.emit('updateLobby','UPDATE', {
        gameID: newGame.gameID,
        gameTime: newGame.gameTime,
        players: newGame.players,
        maxPlayers: newGame.maxPlayers,
        isActive: newGame.isActive,
      });
      newGame&&io.to(game.gameID).emit('updateGameDetails',{
        gameID: newGame.gameID,
        gameTime: newGame.gameTime,
        players: newGame.players,
        maxPlayers: newGame.maxPlayers,
        isActive: newGame.isActive,
      });
      cb({code:200, msg:"successfully left"})
    }else{
      cb({code:400, msg:"couldn't leave the game"})
    }
  })

  const endGameFn = async(gameID:string)=>{
    const game = await getGame(gameID);
    //console.log(gameID,game);
    if(game){
      const podium:{playerID:string,username:string,totalPoints:number}[] = [];

      //Calculate Players' Points
      game.players.forEach(player=>{
        let totalPoints = 0;
        player.pointCards.forEach(card=>{
          totalPoints += card.points;
        });
        player.gems.forEach(gem=>{
          if(gem && gem !== 'Y'){
            totalPoints += 1;
          }
        });
        totalPoints += player.coins.gold * 3;
        totalPoints += player.coins.silver;

        podium.push({playerID: player.id,username:player.username, totalPoints: totalPoints});
        removeGameFromPlayer(player.id);
      })

      //TODO: Add tie condition
      //Sort players based on their points
      for(let i = 0; i < podium.length; i++){
        for(let j = 0; j < (podium.length-i-1); j++){
          if(podium[j].totalPoints < podium[j+1].totalPoints){
            const temp = podium[j];
            podium[j] = podium[j+1];
            podium[j+1] = temp;
          }
        }
      }

      
      io.to(gameID).emit('displayWinner',podium);
    }


    

    const delGame = await deleteGame(gameID);
    
    if(delGame){
      //io.to(gameID).emit('gameClose');
      console.log("leaving room");
      io.socketsLeave(gameID);

      console.log('updating lobby');
      io.emit('updateLobby','DELETE', game);
      
      
      
    }
  }

  socket.on('startGameSignal',async(gameID:string)=>{
    const game = await getGame(gameID);
    if(game){
      game.isActive = true;
      game.coins = {gold:game.players.length*2,silver:game.players.length*2}
      await updateGame(game);
    }
    socket.broadcast.to(gameID).emit('startGame');
    console.log('starting game updates in 3 sec');
    setTimeout(()=>{
      const interval = setInterval(async () => {
        const game = await getGame(gameID);
        if (game) {
          game.gameTime -= 1;
          if (game.gameTime <= 0) {
            await endGameFn(gameID);
            clearInterval(interval);
          }else{
            await updateGame(game);
            io.to(gameID).emit('updateGameTimer', game.gameTime);
          }
          
        }
      }, 1000);
  
      socket.on('endGameTimer', () => {
        console.log('clearing interval');
        clearInterval(interval);  
      });
      

    },3000)
  })

  socket.on('endGameTurn',async(gameObj:IGameDao)=>{
    const game = await getGame(gameObj.gameID);
    if(game){
      await updateGame({
        ...game,
        ...gameObj, 
        turn: game.turn+=1,
        gameTime: game.gameTime
      });
      const updatedGame = await getGame(gameObj.gameID);
      io.to(gameObj.gameID).emit("updateGame",updatedGame);
    }
  })

  socket.once('endGame',async(gameID:string)=>{
    //FIXME: game doesn't get removed from the lobby
    await endGameFn(gameID);
    
  })

  /**
   * End Games Sockets
   */
	
};




export default connection;

