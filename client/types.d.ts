type IPointCard = {
	cardID: number;
	gems: string[];
	points: number;
  
};

type ITradeCard = {
	cardID: number;
	cardType: string;
	from: string[];
	to: string[];
};

type IPlayer = {
	id: string;
  username: string;
	gems: [string, string, string, string, string, string, string, string, string, string];
	activeCards: ITradeCard[];
	restCards: ITradeCard[];
  pointCards: IPointCard[];
	coins: {copper: number; silver: number};
};

type IGame = {
	gameID: string;
  gameTime: number;
	turn: number;
	tradeCards: ITradeCard[];
	pointCards: IPointCard[];
	players: IPlayer[];
  maxPlayers:number;
};