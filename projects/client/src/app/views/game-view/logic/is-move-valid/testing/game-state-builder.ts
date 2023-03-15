import { Card } from 'projects/client/src/app/models/card.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

export class GameStateBuilder {
  private gameState: PlayerGameView;

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
          LaneAdvantage: PlayerOrNone.None,
          Rows: [[], [], [], [], [], [], []],
          WonBy: PlayerOrNone.None,
        },
        {
          LaneAdvantage: PlayerOrNone.None,
          Rows: [[], [], [], [], [], [], []],
          WonBy: PlayerOrNone.None,
        },
        {
          LaneAdvantage: PlayerOrNone.None,
          Rows: [[], [], [], [], [], [], []],
          WonBy: PlayerOrNone.None,
        },
        {
          LaneAdvantage: PlayerOrNone.None,
          Rows: [[], [], [], [], [], [], []],
          WonBy: PlayerOrNone.None,
        },
        {
          LaneAdvantage: PlayerOrNone.None,
          Rows: [[], [], [], [], [], [], []],
          WonBy: PlayerOrNone.None,
        },
      ],
      GameCreatedTimestampUTC: new Date(),
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

  setNoLaneAdvantage(laneIndex: number) {
    this.gameState.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.None;
    return this;
  }

  setGuestLaneAdvantage(laneIndex: number) {
    this.gameState.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.Guest;
    return this;
  }

  setHostLaneAdvantage(laneIndex: number) {
    this.gameState.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.Host;
    return this;
  }

  addCardToLaneOnRow(card: Card, laneIndex: number, rowIndex: number) {
    this.gameState.Lanes[laneIndex].Rows[rowIndex].push(card);
    return this;
  }

  setHostWonBy(laneIndex: number) {
    this.gameState.Lanes[laneIndex].WonBy = PlayerOrNone.Host;
    return this;
  }

  setGuestWonBy(laneIndex: number) {
    this.gameState.Lanes[laneIndex].WonBy = PlayerOrNone.Guest;
    return this;
  }

  setNoneWonBy(laneIndex: number) {
    this.gameState.Lanes[laneIndex].WonBy = PlayerOrNone.None;
    return this;
  }

  setLastCardPlayedOnLane(card: Card, laneIndex: number) {
    this.gameState.Lanes[laneIndex].LastCardPlayed = card;
    return this;
  }

  build() {
    return this.gameState;
  }
}
