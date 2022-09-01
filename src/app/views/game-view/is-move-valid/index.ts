import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';
import { isMoveValidFromPlayerPov } from './is-move-valid-from-player-pov';
import { cloneLaneToHostPov } from './clone-lane-to-host-pov';
import { cloneMoveToHostPov } from './clone-move-to-host-pov';

export function isMoveValid(move: MoveModel, gameState: PlayerGameStateModel) {
  const { IsHost, IsHostPlayersTurn } = gameState;
  const hostAndHostTurn = IsHostPlayersTurn && IsHost;
  const guestAndGuestTurn = !IsHostPlayersTurn && !IsHost;
  const isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;

  if (!isPlayersTurn) {
    return false;
  }

  const lane = gameState.Lanes[move.TargetLaneIndex];

  const playerPovLane = IsHost ? lane : cloneLaneToHostPov(lane);
  const playerPovMove = IsHost ? move : cloneMoveToHostPov(move);

  return isMoveValidFromPlayerPov(playerPovLane, playerPovMove);
}
