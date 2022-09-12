import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { notPlayersTurn } from './not-players-turn';

describe('[Move Check]: not players turn', () => {
  it('should return true when player is host and it is guests turn', () => {
    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setIsHostPlayersTurn(false)
      .build();

    expect(notPlayersTurn(gameState)).toBe(true);
  });

  it('should return true when player is guest and it is hosts turn', () => {
    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setIsHostPlayersTurn(true)
      .build();

    expect(notPlayersTurn(gameState)).toBe(true);
  });

  it('should return false when player is host and it is hosts turn', () => {
    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setIsHostPlayersTurn(true)
      .build();

    expect(notPlayersTurn(gameState)).toBe(false);
  });

  it('should return false when player is guest and it is guests turn', () => {
    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setIsHostPlayersTurn(false)
      .build();

    expect(notPlayersTurn(gameState)).toBe(false);
  });
});
