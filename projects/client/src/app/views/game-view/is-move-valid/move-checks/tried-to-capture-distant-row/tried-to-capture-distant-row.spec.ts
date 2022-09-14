import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { triedToCaptureDistantRow } from '.';
import { GameStateBuilder } from '../../testing/game-state-builder';
import { MoveBuilder } from '../../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../../testing/place-card-attempt-builder';

describe('[Move Check]: tried to capture distant row', () => {
  it('should return false if host played first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeFalse();
  });

  it('should return false if guest played first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeFalse();
  });

  it('should return true if host played second position with no first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(1)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });

  it('should return true if guest played second position with no first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(5)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });

  it('should return true if host played first guest side position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });

  it('should return true if guest played first host side position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });

  it('should return true if host tried to capture second position when guest has first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(1)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const guestCard: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .addCardToLaneOnRow(guestCard, 0, 0)
      .build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });

  it('should return true if guest tried to capture second position when host has first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(5)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const guestCard: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .addCardToLaneOnRow(guestCard, 0, 6)
      .build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTrue();
  });
});
