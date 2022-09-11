import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { isAnyPlaceCardAttemptInMiddle } from './is-any-place-card-attempt-in-middle';

describe('[Move Check]: is any place card attempt in middle', () => {
  it('should return true when a place card attempt is in the middle', () => {
    const targetLaneIndex = 3;
    const move = getTestMove(targetLaneIndex);
    const result = isAnyPlaceCardAttemptInMiddle(move);

    expect(result).toBe(true);
  });

  it('should return false when there are no place card attempts in middle', () => {
    const targetLaneIndex = 0;
    const move = getTestMove(targetLaneIndex);
    const result = isAnyPlaceCardAttemptInMiddle(move);

    expect(result).toBe(false);
  });

  function getTestMove(TargetLaneIndex: number) {
    const move: MoveModel = {
      PlaceCardAttempts: [
        {
          Card: {
            Kind: KindModel.Ace,
            Suit: SuitModel.Spades,
            PlayedBy: PlayerOrNoneModel.Host,
          },
          TargetLaneIndex,
          TargetRowIndex: 0,
        },
      ],
    };

    return move;
  }
});
