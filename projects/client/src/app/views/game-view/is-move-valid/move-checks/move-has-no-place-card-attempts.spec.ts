import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { moveHasNoPlaceCardAttempts } from './move-has-no-place-card-attempts';

describe('[Move Check]: move has no place card attempts', () => {
  it('should return true if the move has no place card attempts', () => {
    const numPlaceCardAttempts = 0;
    const move = getTestMove(numPlaceCardAttempts);
    const result = moveHasNoPlaceCardAttempts(move);

    expect(result).toBe(true);
  });

  it('should return false if the move has place card attempts', () => {
    const numPlaceCardAttempts = 3;
    const move = getTestMove(numPlaceCardAttempts);
    const result = moveHasNoPlaceCardAttempts(move);

    expect(result).toBe(false);
  });
});

function getTestMove(numPlaceCardAttempts: number) {
  const placeCardAttempt: PlaceCardAttemptModel = {
    Card: {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    },
    TargetLaneIndex: 0,
    TargetRowIndex: 0,
  };

  const move: MoveModel = {
    PlaceCardAttempts: [],
  };

  for (let i = 0; i < numPlaceCardAttempts; i++) {
    move.PlaceCardAttempts.push(placeCardAttempt);
  }

  return move;
}
