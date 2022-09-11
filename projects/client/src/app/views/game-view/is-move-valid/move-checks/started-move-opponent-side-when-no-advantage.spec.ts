import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { startedMoveOpponentSideWhenNoAdvantage } from './started-move-opponent-side-when-no-advantage';

describe('[Move Check]: started move opponent side when no advantage', () => {
  it('should return true if host place card attempt is guest side when there is no lane advantage', () => {
    const playerIsHost = true;
    const targetRowIndex = 6;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(true);
  });

  it('should return false if host place card attempt is host side when there is no lane advantage', () => {
    const playerIsHost = true;
    const targetRowIndex = 0;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(false);
  });

  it('should return true if guest place card attempt is host side when there is no lane advantage', () => {
    const playerIsHost = false;
    const targetRowIndex = 0;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(true);
  });

  it('should return false if guest place card attempt is guest side when there is no lane advantage', () => {
    const playerIsHost = false;
    const targetRowIndex = 6;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(false);
  });
});

function getTestResult(IsHost: boolean, TargetRowIndex: number) {
  const gameState = getNoLaneAdvantageGameState(IsHost) as PlayerGameStateModel;
  const move = getTestMove(TargetRowIndex);
  const result = startedMoveOpponentSideWhenNoAdvantage(gameState, move);

  return result;
}

function getNoLaneAdvantageGameState(IsHost: boolean) {
  const partialTestGameState: Partial<PlayerGameStateModel> = {
    Lanes: [
      {
        LaneAdvantage: PlayerOrNoneModel.None,
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
