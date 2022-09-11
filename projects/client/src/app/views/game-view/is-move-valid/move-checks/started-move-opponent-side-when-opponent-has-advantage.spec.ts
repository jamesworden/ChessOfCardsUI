import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { startedMoveOpponentSideWhenOpponentHasAdvantage } from './started-move-opponent-side-when-opponent-has-advantage';

describe('[Move Check]: started move opponent side when opponent has advantage', () => {
  it('should return true when host moved guest side when guest has advantage', () => {
    const playerIsHost = true;
    const targetRowIndex = 6;
    const laneAdvantage = PlayerOrNoneModel.Guest;
    const result = getTestResult(playerIsHost, targetRowIndex, laneAdvantage);

    expect(result).toBe(true);
  });

  it('should return false when host moved guest side when host has advantage', () => {
    const playerIsHost = true;
    const targetRowIndex = 6;
    const laneAdvantage = PlayerOrNoneModel.Host;
    const result = getTestResult(playerIsHost, targetRowIndex, laneAdvantage);

    expect(result).toBe(false);
  });

  it('should return true when guest moved host side when host has advantage', () => {
    const playerIsHost = false;
    const targetRowIndex = 0;
    const laneAdvantage = PlayerOrNoneModel.Host;
    const result = getTestResult(playerIsHost, targetRowIndex, laneAdvantage);

    expect(result).toBe(true);
  });

  it('should return false when guest moved host side when guest has advantage', () => {
    const playerIsHost = false;
    const targetRowIndex = 0;
    const laneAdvantage = PlayerOrNoneModel.Guest;
    const result = getTestResult(playerIsHost, targetRowIndex, laneAdvantage);

    expect(result).toBe(false);
  });
});

function getTestResult(
  IsHost: boolean,
  TargetRowIndex: number,
  LaneAdvantage: PlayerOrNoneModel
) {
  const gameState = getGameState(IsHost, LaneAdvantage) as PlayerGameStateModel;
  const move = getTestMove(TargetRowIndex);
  const result = startedMoveOpponentSideWhenOpponentHasAdvantage(
    gameState,
    move
  );

  return result;
}

function getGameState(IsHost: boolean, LaneAdvantage: PlayerOrNoneModel) {
  const partialTestGameState: Partial<PlayerGameStateModel> = {
    Lanes: [
      {
        LaneAdvantage,
        Rows: [[], [], [], [], [], [], []],
        WonBy: PlayerOrNoneModel.None,
      },
    ],
    IsHost,
  };

  return partialTestGameState;
}

function getTestMove(TargetRowIndex: number) {
  const move: MoveModel = {
    PlaceCardAttempts: [
      {
        Card: {
          Kind: KindModel.Ace,
          Suit: SuitModel.Spades,
          PlayedBy: PlayerOrNoneModel.Host,
        },
        TargetLaneIndex: 0,
        TargetRowIndex,
      },
    ],
  };

  return move;
}
