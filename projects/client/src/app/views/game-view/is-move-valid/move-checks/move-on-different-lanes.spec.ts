import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { moveOnDifferentLanes } from './move-on-different-lanes';

describe('[Move Check]: move on different lanes', () => {
  it('should return true when move has place card attempts on different target lanes', () => {
    const move = getTestMove();
    const laneIndexZero = getTestPlaceCardAttemptOnLane(0);
    const laneIndexOne = getTestPlaceCardAttemptOnLane(1);
    const laneIndexTwo = getTestPlaceCardAttemptOnLane(2);
    move.PlaceCardAttempts.push(laneIndexZero, laneIndexOne, laneIndexTwo);
    const result = moveOnDifferentLanes(move);

    expect(result).toBe(true);
  });

  it('should return false when move has place card attempts on only one target lane', () => {
    const move = getTestMove();
    const laneIndexZero1 = getTestPlaceCardAttemptOnLane(0);
    const laneIndexZero2 = getTestPlaceCardAttemptOnLane(0);
    const laneIndexZero3 = getTestPlaceCardAttemptOnLane(0);
    move.PlaceCardAttempts.push(laneIndexZero1, laneIndexZero2, laneIndexZero3);
    const result = moveOnDifferentLanes(move);

    expect(result).toBe(false);
  });
});

function getTestMove() {
  const move: MoveModel = {
    PlaceCardAttempts: [],
  };

  return move;
}

function getTestPlaceCardAttemptOnLane(TargetLaneIndex: number) {
  const placeCardAttempt: PlaceCardAttemptModel = {
    Card: {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    },
    TargetLaneIndex,
    TargetRowIndex: 0,
  };

  return placeCardAttempt;
}
