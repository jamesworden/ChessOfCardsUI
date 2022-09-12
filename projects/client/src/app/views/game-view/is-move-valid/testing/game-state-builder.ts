import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export class GameStateBuilder {
  private gameState: PlayerGameStateModel;

  constructor() {
    this.gameState = {
      IsHost: true,
      IsHostPlayersTurn: true,
      NumCardsInOpponentsDeck: 21,
      NumCardsInOpponentsHand: 5,
      NumCardsInPlayersDeck: 21,
      Hand: {
        Cards: [],
      },
      Lanes: [
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
        {
          LaneAdvantage: PlayerOrNoneModel.None,
          Rows: [],
          WonBy: PlayerOrNoneModel.None,
        },
      ],
    };
  }

  setIsHost(isHost: boolean) {
    this.gameState.IsHost = isHost;
    return this;
  }

  setIsHostPlayersTurn(isHostPlayersTurn: boolean) {
    this.gameState.IsHostPlayersTurn = isHostPlayersTurn;
    return this;
  }

  build() {
    return this.gameState;
  }
}
