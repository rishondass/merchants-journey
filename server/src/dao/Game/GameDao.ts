import {IGame, type IPlayer, type IPointCard, type ITradeCard} from '../../models/game';
import {v4 as uuidv4} from 'uuid';
import * as TradeCardsJSON from '../../../json/TradeCards.json';
import * as PointCardsJSON from '../../../json/PointCards.json';


export type IGameDao = {
	fields: () => Array<string | number | ITradeCard[] | IPointCard[] | IPlayer[]>;
	addPlayer: (player: IPlayer) => void;
	removePlayer: (player: IPlayer) => void;
};

export class GameDao implements IGameDao {
	private readonly gameID: string;
	private readonly turn: number;
	private readonly tradeCards: ITradeCard[];
	private readonly pointCards: IPointCard[];
	private readonly players: IPlayer[];

	constructor() {
		this.gameID = uuidv4();
		this.turn = 0;
		this.players = new Array<IPlayer>(5);
		this.tradeCards = TradeCardsJSON.splice(2) as ITradeCard[];
		this.pointCards = PointCardsJSON as IPointCard[];
	}

	public fields() {
		return [this.gameID, this.turn, this.players, this.tradeCards, this.pointCards];
	}

	public addPlayer(player: IPlayer): void {
		console.log('test');
	}

	public removePlayer(player: IPlayer): void {
		console.log('test');
	}
}