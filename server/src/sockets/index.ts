import {type Socket} from 'socket.io';
import { GameDao, PlayerDao } from "../dao";
import {getPlayer,getAllPlayers,removePlayer, addGameToPlayer, removeGameFromPlayer} from '../lib/playerList';
import {addGame as addGameObj, getGames, getGame, updateGame, deleteGame} from "../lib/gameList";
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
    const gameObj = new GameDao(game.players,game.time);
    gameObj.addPlayer(new PlayerDao(socket.data.user.id,socket.data.user.auth.username));
    addGameToPlayer(socket.data.user.id, gameObj.gameID);
    socket.data.user.gameID = gameObj.gameID;
    addGameObj(gameObj);
    io.emit('updateLobby','CREATE', gameObj);
    socket.join(gameObj.gameID);
    cb(gameObj.gameID)
  })

  socket.on('deleteGame',(gameID:string,cb)=>{
    if(deleteGame(gameID)){
      socket.leave(gameID);
      io.to(gameID).emit('gameClose');
      cb({status:200,msg:"success"})
    }else{
      cb({status:500, msg: "couldn't delete game"})
    }
  })

  //FIXME:Don't send all game data to lobby
  socket.on('getGames',(cb)=>{
    const games = getGames();
    cb(games);
  })

  socket.on('getGame',(gameID, cb)=>{
    
    const game = getGame(gameID);
    console.log(game,gameID);
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
        //TODO:Add people in the lobby to a lobby room and leave the lobby when they join the game room
        socket.join(game.gameID);
        game.addPlayer(new PlayerDao(socket.data.user.id,socket.data.user.auth.username))
        addGameToPlayer(socket.data.user.id, game.gameID);
        socket.data.user.gameID = game.gameID;
        updateGame(game);
        io.emit('updateLobby','UPDATE', game);
        io.to(game.gameID).emit('updateGame',game);
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
      io.emit('updateLobby','UPDATE', game);
      io.to(game.gameID).emit('updateGame',game);
      cb({code:200, msg:"successfully left"})
    }else{
      cb({code:400, msg:"couldn't leave the game"})
    }
  })

  /**
   * End Games Sockets
   */
	
};




export default connection;

