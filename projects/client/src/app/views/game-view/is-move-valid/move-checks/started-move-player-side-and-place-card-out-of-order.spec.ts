import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMovePlayerSideAndPlaceCardOutOfOrder } from './started-move-player-side-and-place-card-out-of-order';

describe('[Move Check]: started move player side and place card out of order', () => {
  it('should return true when hosts first move is on their second position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(1)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setNoLaneAdvantage(0)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(true);
  });

  it('should return false when hosts first move is on their first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setNoLaneAdvantage(0)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(false);
  });

  it('should return true when guests first move is on their second position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(5)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setNoLaneAdvantage(0)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(true);
  });

  it('should return false when guests first move is on their first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setNoLaneAdvantage(0)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(false);
  });

  it('should return true when hosts first move is on their second position and the first position has a guest card', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(1)
      .build();

    const guestCard: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setNoLaneAdvantage(0)
      .addCardToLaneOnRow(guestCard, 0, 0)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(true);
  });

  it('should return true when guests first move is on their second position and the first position has a host card', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(5)
      .build();

    const hostCard: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setNoLaneAdvantage(0)
      .addCardToLaneOnRow(hostCard, 0, 6)
      .build();

    const result = startedMovePlayerSideAndPlaceCardOutOfOrder(gameState, move);

    expect(result).toBe(true);
  });
});
