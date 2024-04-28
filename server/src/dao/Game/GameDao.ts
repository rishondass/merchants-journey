import {IGame, type IPlayer, type IPointCard, type ITradeCard} from '../../models/game';
import {v4 as uuidv4} from 'uuid';
import TradeCardsJSON from '../../../json/TradeCards.json';
import PointCardsJSON from '../../../json/PointCards.json';


export type IGameDao = {
	fields: () => Array<string | number | ITradeCard[] | IPointCard[] | IPlayer[]>;
	addPlayer: (player: IPlayer) => void;
	removePlayer: (player: IPlayer) => void;
} & IGame;

const shuffleTrade = (array:ITradeCard[]) =>{
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;

}

const shufflePoint = (array:IPointCard[]) =>{
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;

}

export class GameDao implements IGameDao {
	public readonly gameID: string;
  public readonly gameTime: number;
	public readonly turn: number;
  public readonly maxPlayers: number;
	public readonly tradeCards: ITradeCard[];
	public readonly pointCards: IPointCard[];
	public readonly players: IPlayer[];

	constructor(playerCount: number,gameTime:number) {
		this.gameID = uuidv4();
    this.gameTime = gameTime;
		this.turn = 0;
    this.maxPlayers = playerCount;
		this.players = [];
		this.tradeCards = shuffleTrade(TradeCardsJSON.splice(2) as ITradeCard[]);
		this.pointCards = shufflePoint(PointCardsJSON as IPointCard[]);
	}

	public fields() {
		return [this.gameID, this.turn, this.players, this.tradeCards, this.pointCards];
	}

	public addPlayer(player: IPlayer) {
    if(this.players.length === 0){
      player.gems = ['Y','Y','Y','','','','','','',''];
      this.players.push(player);
    }
    else if(this.players.length == 1){
      player.gems = ['Y','Y','Y','Y','','','','','',''];
      this.players.push(player);
    }
    else if(this.players.length == 2){
      player.gems = ['Y','Y','Y','Y','','','','','',''];
      this.players.push(player);
    }
    else if(this.players.length == 3){
      player.gems = ['Y','Y','Y','G','','','','','',''];
      this.players.push(player);
    }
    else if(this.players.length == 4){
      player.gems = ['Y','Y','Y','G','','','','','',''];
      this.players.push(player);
    }
	}

	public removePlayer(player: IPlayer): void {
		console.log('test');
	}
}