
export type IPointCard = {
	cardID: number;
	gems: string[];
	points: number;
  
};

export type ITradeCard = {
	cardID: number;
	cardType: string;
	from: string[];
	to: string[];
  extraGems: string[];
};


export type IPlayer = {
	id: string;
  username: string;
	gems: [string, string, string, string, string, string, string, string, string, string];
	activeCards: ITradeCard[];
	restCards: ITradeCard[];
  pointCards: IPointCard[];
	coins: {gold: number; silver: number};
};

export type IGame = {
	gameID: string;
  gameTime: number;
	turn: number;
	tradeCards: ITradeCard[];
	pointCards: IPointCard[];
	players: IPlayer[];
  maxPlayers:number;
  isActive: boolean;
  coins: {gold: number, silver:number}
};