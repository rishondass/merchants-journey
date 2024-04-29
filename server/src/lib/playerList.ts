import {playerAuth} from "./types"
const playerList:playerAuth  = {};


// Function to add a player to the playerList
function addPlayer(id:string,username:string,token:string, expires:number) {
  playerList[id] = {id:id, auth:{username,token, expires}};
  return playerList[id];
}

// Function to remove a player from the playerList
function removePlayer(id:string) {
  delete playerList[id];
}

// Function to get player by username from the playerList
function getPlayer(id:string) {
  return playerList[id];
}

function getAllPlayers(){
  return playerList;
}

function addGameToPlayer(id:string,gameID: string){
  playerList[id] = {...playerList[id],gameID: gameID}
}

function removeGameFromPlayer(id:string){
  playerList[id] = {...playerList[id],gameID: undefined}
}

export {addGameToPlayer,removeGameFromPlayer,addPlayer, removePlayer, getPlayer, getAllPlayers };


