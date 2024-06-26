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
  extraGems: string[];
};

type IPlayer = {
	id: string;
  username: string;
	gems: string[];
	activeCards: ITradeCard[];
	restCards: ITradeCard[];
  pointCards: IPointCard[];
	coins: {gold: number; silver: number};
};

type IGame = {
	gameID: string;
  gameTime: number;
	turn?: number;
	tradeCards?: ITradeCard[];
	pointCards?: IPointCard[];
	players: IPlayer[];
  maxPlayers:number;
  isActive: boolean;
  coins: {gold: number, silver:number}
};

type podium = {
  playerID:string,username:string,totalPoints:number
}[]