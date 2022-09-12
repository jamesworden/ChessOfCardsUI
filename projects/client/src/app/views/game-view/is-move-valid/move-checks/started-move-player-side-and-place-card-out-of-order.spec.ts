import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { startedMovePlayerSideAndPlaceCardOutOfOrder } from './started-move-player-side-and-place-card-out-of-order';

describe('[Move Check]: started move player side and place card out of order', () => {
  it('should return true when hosts first move is on their second position', () => {
    const playerIsHost = true;
    const targetRowIndex = 1;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(true);
  });

  it('should return false when hosts first move is on their first position', () => {
    const playerIsHost = true;
    const targetRowIndex = 0;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(false);
  });

  it('should return true when guests first move is on their second position', () => {
    const playerIsHost = true;
    const targetRowIndex = 5;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(false);
  });

  it('should return false when guests first move is on their first position', () => {
    const playerIsHost = true;
    const targetRowIndex = 6;
    const result = getTestResult(playerIsHost, targetRowIndex);

    expect(result).toBe(false);
  });
});

function getTestResult(isHost: boolean, targetRowIndex: number) {
  const gameState = getNoAdvantageGameState(isHost) as PlayerGameStateModel;
  const move = getTestMove(targetRowIndex);
  const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

  return result;
}

function getNoAdvantageGameState(IsHost: boolean) {
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
