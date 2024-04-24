
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
};


export type IPlayer = {
	id: string;
	gameID: string;
	gems: [string, string, string, string, string, string, string, string, string, string];
	activeCards: ITradeCard[];
	restCards: ITradeCard[];
	coins: {copper: number; silver: number};
};

export type IGame = {
	gameID: string;
	turn: number;
	tradeCards: ITradeCard[];
	pointCards: IPointCard[];
	players: IPlayer[];

};