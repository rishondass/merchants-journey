import {type Socket} from 'socket.io';
import { GameDao, IGameDao, PlayerDao } from "../dao";
import {getPlayer,getAllPlayers,removePlayer, addGameToPlayer, removeGameFromPlayer} from '../lib/playerList';
import {addGame as addGameObj, getGamesDetails,getGameDetails, getGame, updateGame, deleteGame} from "../lib/gameList";
import {io} from "../index"


const connection = (socket: Socket) => {
	//console.log(socket.data.user);
  //console.log(playerList)
  socket.on('disconnect',()=>{
  })

  socket.on('logOff', ()=>{
    removePlayer(socket.data.user.id);
  })

  if(socket.data.user)
    socket.emit("authToken",socket.data.user.id,socket.data.user.auth.username,socket.data.user.gameID, socket.data.user.auth.token, socket.data.user.auth.expires);
	
  /**
   * Games Sockets
   */

  socket.on('createGame',(game,cb)=>{
    const gameObj = new GameDao(game.players,10);
    gameObj.addPlayer(new PlayerDao(socket.data.user.id,socket.data.user.auth.username));
    addGameToPlayer(socket.data.user.id, gameObj.gameID);
    //socket.data.user.gameID = gameObj.gameID;
    addGameObj(gameObj);
    io.emit('updateLobby','CREATE', gameObj);
    socket.join(gameObj.gameID);
    cb(gameObj.gameID)
  })

  socket.on('deleteGame',(gameID:string,cb)=>{
    const game = deleteGame(gameID);
    if(game){
      socket.leave(gameID);
      io.to(gameID).emit('gameClose');
      io.emit('updateLobby','DELETE', game);
      cb({status:200,msg:"success"})
    }else{
      cb({status:500, msg: "couldn't delete game"})
    }
  })

  
  socket.on('getGames',(cb)=>{
    const games = getGamesDetails();
    cb(games);
  })

  socket.on('getGame',(gameID, cb)=>{
    
    const game = getGame(gameID);
    if(game){
      cb(game);
    }else{
      cb(null)
    }
  })

  socket.on('getGameDetails',(gameID, cb)=>{
    
    const game = getGameDetails(gameID);
    if(game){
      cb(game);
    }else{
      cb(null)
    }
  })

  socket.on('joinGame',(gameID:string,cb)=>{
    const game = getGame(gameID);
    if(game){
      if(game.players.length < game.maxPlayers){
        socket.join(game.gameID);
        game.addPlayer(new PlayerDao(socket.data.user.id,socket.data.user.auth.username))
        addGameToPlayer(socket.data.user.id, game.gameID);
        socket.data.user.gameID = game.gameID;
        updateGame(game);
        io.emit('updateLobby','UPDATE', {
          gameID:game.gameID,
          gameTime:game.gameTime,
          players:game.players,
          maxPlayers:game.maxPlayers,
          isActive:game.isActive,
        });
        io.to(game.gameID).emit('updateGameDetails',{
          gameID: game.gameID,
          gameTime: game.gameTime,
          players: game.players,
          maxPlayers: game.maxPlayers,
          isActive: game.isActive,
        });
        cb({code:200, msg:"successfully joined"})
      }else{
        cb({code:400, msg:"game is already full"})
      }
      
    }else{
      cb({code:404, msg:"game doesn't exist"})
    }
  })

  socket.on('leaveGame',(gameID:string, cb)=>{
    const game = getGame(gameID);
    if(game){
      socket.leave(gameID);
      game.removePlayer(socket.data.user.id);
      removeGameFromPlayer(socket.data.user.id);
      socket.data.user.gameID = "";
      updateGame(game);
      io.emit('updateLobby','UPDATE', {
        gameID: game.gameID,
        gameTime: game.gameTime,
        players: game.players,
        maxPlayers: game.maxPlayers,
        isActive: game.isActive,
      });
      io.to(game.gameID).emit('updateGameDetails',{
        gameID: game.gameID,
        gameTime: game.gameTime,
        players: game.players,
        maxPlayers: game.maxPlayers,
        isActive: game.isActive,
      });
      cb({code:200, msg:"successfully left"})
    }else{
      cb({code:400, msg:"couldn't leave the game"})
    }
  })

  const endGameFn = (gameID:string)=>{
    const game = getGame(gameID);
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
          if(podium[j].totalPoints > podium[j+1].totalPoints){
            const temp = podium[j];
            podium[j] = podium[j+1];
            podium[j+1] = temp;
          }
        }
      }

      
      io.to(gameID).emit('displayWinner',podium);
    }


    

    const delGame = deleteGame(gameID);
    
    if(delGame){
      //io.to(gameID).emit('gameClose');
      console.log("leaving room");
      io.socketsLeave(gameID);

      setTimeout(()=>{
        io.emit('updateLobby','DELETE', game);
      },2000)
      
      
      
    }
    console.log(getGamesDetails());
  }

  socket.on('startGameSignal',(gameID:string)=>{
    const game = getGame(gameID);
    if(game){
      game.isActive = true;
      game.coins = {gold:game.players.length*2,silver:game.players.length*2}
      updateGame(game);
    }
    socket.broadcast.to(gameID).emit('startGame');
    console.log('starting game updates in 3 sec');
    setTimeout(()=>{
      const interval = setInterval(()=>{
        const game = getGame(gameID);
        if(game){
          game.gameTime -= 1;
          if(game.gameTime <= 0){
            endGameFn(gameID);
            clearInterval(interval);
          }
          updateGame(game);
          io.to(gameID).emit('updateGameTimer',game.gameTime);
          
        }
        
        
      },1000);

      socket.on('endGameTimer',()=>{
        console.log('clearing interval');
        
      })
      

    },3000)
  })

  socket.on('endGameTurn',(gameObj:IGameDao)=>{
    const game = getGame(gameObj.gameID);
    if(game){
      const updatedGame = updateGame({...game,...gameObj, turn: game.turn+=1})
      io.to(gameObj.gameID).emit("updateGame",updatedGame);
    }
  })

  socket.once('endGame',(gameID:string)=>{
    endGameFn(gameID);
    
  })

  /**
   * End Games Sockets
   */
	
};




export default connection;

