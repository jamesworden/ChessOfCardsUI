import { PlayerGameState } from '../models/player-game-state';

export const emptyGameState: PlayerGameState = {
  Hand: {
    Cards: [],
  },
  Lanes: [],
  NumCardsInOpponentsDeck: 21,
  NumCardsInOpponentsHand: 5,
  NumCardsInPlayersDeck: 21,
};
