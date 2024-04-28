import {type IPlayer, type IPointCard, type ITradeCard} from '../../models/game';
import TradeCardsJSON from '../../../json/TradeCards.json';


export class PlayerDao implements IPlayer {
  public readonly id: string;
  public readonly username: string;
  public gems: [string, string, string, string, string, string, string, string, string, string];
  public activeCards: ITradeCard[];
  public restCards: ITradeCard[];
  public pointCards: IPointCard[];
  public coins: {
      copper: number;
      silver: number;
  }

  constructor(id:string,username:string){
    this.id = id;
    this.username = username;
    this.gems = ['','','','','','','','','',''];
    this.activeCards = TradeCardsJSON.slice(0,2) as ITradeCard[];
    this.restCards = [] as ITradeCard[];
    this.pointCards = [] as IPointCard[];
    this.coins = {copper:0,silver:0}
  }
}