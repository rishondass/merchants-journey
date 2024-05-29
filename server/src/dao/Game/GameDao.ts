import {IGame, type IPlayer, type IPointCard, type ITradeCard} from '../../models/game';
import {v4 as uuidv4} from 'uuid';
import TradeCardsJSON from '../../../json/TradeCards.json';
import PointCardsJSON from '../../../json/PointCards.json';


export type IGameDao = IGame;

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

export class GameDao implements IGame{
	public readonly gameID: string;
  public readonly gameTime: number;
	public readonly turn: number;
  public readonly maxPlayers: number;
	public readonly tradeCards: ITradeCard[];
	public readonly pointCards: IPointCard[];
	public readonly players: IPlayer[];
  public isActive:boolean;
  public coins: {gold:number, silver:number}

	constructor(playerCount: number,gameTime:number) {
		this.gameID = uuidv4();
    this.gameTime = gameTime;
		this.turn = 0;
    this.isActive = false;
    this.maxPlayers = playerCount;
		this.players = [];
		this.tradeCards = shuffleTrade([...TradeCardsJSON].splice(2) as ITradeCard[]);;
		this.pointCards = shufflePoint([...PointCardsJSON] as IPointCard[]);
    this.coins = {gold:0,silver:0};
  }
}