import { Card } from 'projects/client/src/app/models/card.model';
import { DurationOption } from 'projects/client/src/app/models/duration-option.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

export class GameStateBuilder {
  private playerGameView: PlayerGameView;

  constructor() {
    this.playerGameView = {
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
      GameCreatedTimestampUTC: '',
      DurationOption: DurationOption.FiveMinutes,
      MovesMade: [],
    };
  }

  setIsHost(isHost: boolean) {
    this.playerGameView.IsHost = isHost;
    return this;
  }

  setIsHostPlayersTurn(isHostPlayersTurn: boolean) {
    this.playerGameView.IsHostPlayersTurn = isHostPlayersTurn;
    return this;
  }

  setNoLaneAdvantage(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.None;
    return this;
  }

  setGuestLaneAdvantage(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.Guest;
    return this;
  }

  setHostLaneAdvantage(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].LaneAdvantage = PlayerOrNone.Host;
    return this;
  }

  addCardToLaneOnRow(card: Card, laneIndex: number, rowIndex: number) {
    this.playerGameView.Lanes[laneIndex].Rows[rowIndex].push(card);
    return this;
  }

  setHostWonBy(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].WonBy = PlayerOrNone.Host;
    return this;
  }

  setGuestWonBy(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].WonBy = PlayerOrNone.Guest;
    return this;
  }

  setNoneWonBy(laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].WonBy = PlayerOrNone.None;
    return this;
  }

  setLastCardPlayedOnLane(card: Card, laneIndex: number) {
    this.playerGameView.Lanes[laneIndex].LastCardPlayed = card;
    return this;
  }

  build() {
    return this.playerGameView;
  }
}
