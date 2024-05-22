import { type IGameDao} from "../dao"
import { IGame, IPlayer } from "../models/game";
const gameList: Record<string, { game: IGameDao }> = {};
import { redisClient, redisPromise } from '../';

(async () => {
  await redisPromise;

  // Now you can safely use redisClient

  const addGame = async (game: IGameDao) => {
    await redisClient.set(game.gameID, JSON.stringify(game));
    console.log(`[ADD] Added game with ID: ${game.gameID}`);
  };

  const getGamesDetails = async () => {
    const keys = await redisClient.keys('*');
    const games = [];
    for (const key of keys) {
      const game = JSON.parse(await redisClient.get(key));
      games.push({
        gameID: game.gameID,
        gameTime: game.gameTime,
        players: game.players,
        maxPlayers: game.maxPlayers,
        isActive: game.isActive,
      });
    }
    console.log(`[GET GAMES DETAILS] Result:`, JSON.stringify(games, null, 2));
    return games;
  };

  const getGameDetails = async (gameID: string) => {
    const game = await redisClient.get(gameID);
    if (game) {
      const gameDetails = JSON.parse(game);
      console.log(`[GET GAME DETAILS] for ID ${gameID}:`, JSON.stringify(gameDetails, null, 2));
      return {
        gameID: gameDetails.gameID,
        gameTime: gameDetails.gameTime,
        players: gameDetails.players,
        maxPlayers: gameDetails.maxPlayers,
        isActive: gameDetails.isActive,
      };
    } else {
      console.log(`[GET GAME DETAILS] Game with ID ${gameID} not found.`);
      return null;
    }
  };

  const getGame = async (gameID: string) => {
    const game = await redisClient.get(gameID);
    if (game) {
      console.log(`[GET GAME] for ID ${gameID}:`, JSON.stringify(JSON.parse(game), null, 2));
      return JSON.parse(game);
    } else {
      console.log(`[GET GAME] Game with ID ${gameID} not found.`);
      return null;
    }
  };

  const updateGame = async (game: IGameDao) => {
    await redisClient.set(game.gameID, JSON.stringify(game));
    console.log(`[UPDATE] Updated game with ID: ${game.gameID}`);
  };

  const deleteGame = async (gameID: string) => {
    const game = await redisClient.get(gameID);
    if (game) {
      await redisClient.del(gameID);
      console.log(`[DELETE] Deleted game with ID: ${gameID}`);
      return JSON.parse(game);
    } else {
      console.log(`[DELETE] Game with ID: ${gameID} not found.`);
      return null;
    }
  };
})();
