import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { notPlayersTurn } from './not-players-turn';

describe('[Move Check]: not players turn', () => {
  it('should return true when player is host and it is guests turn', () => {
    const isHost = true;
    const isHostPlayersTurn = false;
    const gameState = getPartialTestGameState(
      isHost,
      isHostPlayersTurn
    ) as PlayerGameStateModel;
    const hostAndGuestTurnResult = notPlayersTurn(gameState);

    expect(hostAndGuestTurnResult).toBe(true);
  });

  it('should return true when player is guest and it is hosts turn', () => {
    const isHost = false;
    const isHostPlayersTurn = true;
    const gameState = getPartialTestGameState(
      isHost,
      isHostPlayersTurn
    ) as PlayerGameStateModel;
    const guestAndHostTurnResult = notPlayersTurn(gameState);

    expect(guestAndHostTurnResult).toBe(true);
  });

  it('should return false when player is host and it is hosts turn', () => {
    const isHost = true;
    const isHostPlayersTurn = true;
    const gameState = getPartialTestGameState(
      isHost,
      isHostPlayersTurn
    ) as PlayerGameStateModel;
    const hostAndGuestTurnResult = notPlayersTurn(gameState);

    expect(hostAndGuestTurnResult).toBe(false);
  });

  it('should return false when player is guest and it is guests turn', () => {
    const isHost = false;
    const isHostPlayersTurn = false;
    const gameState = getPartialTestGameState(
      isHost,
      isHostPlayersTurn
    ) as PlayerGameStateModel;
    const guestAndHostTurnResult = notPlayersTurn(gameState);

    expect(guestAndHostTurnResult).toBe(false);
  });
});

function getPartialTestGameState(IsHost: boolean, IsHostPlayersTurn: boolean) {
  const partialTestGameState: Partial<PlayerGameStateModel> = {
    IsHost,
    IsHostPlayersTurn,
  };

  return partialTestGameState;
}
