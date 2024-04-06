import { Kind, Suit } from '@client/models';
import { GameStateBuilder } from '../../testing/game-state-builder';
import { MoveBuilder } from '../../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../../testing/place-card-attempt-builder';
import { getFirstPlaceCardAttempt } from './get-first-place-card-attempt';

describe('[Move Check Logic]: get first place card attempt', () => {
  it('should return first place card attempt when host', () => {
    const one = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(0)
      .build();

    const two = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(0)
      .build();

    const three = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(three)
      .addPlaceCardAttempt(one)
      .addPlaceCardAttempt(two)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(getFirstPlaceCardAttempt(gameState, move)).toEqual(one);
  });

  it('should return first place card attempt when guest', () => {
    const one = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(6)
      .build();

    const two = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(5)
      .build();

    const three = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetRowIndex(4)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(three)
      .addPlaceCardAttempt(one)
      .addPlaceCardAttempt(two)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(getFirstPlaceCardAttempt(gameState, move)).toEqual(one);
  });
});
