import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';
import { isMoveValidFromHostPov } from './is-move-valid-from-host-pov';
import * as _ from 'lodash';
import { convertLaneToHostPov } from './convert-lane-to-host-pov';
import { convertMoveToHostPov } from './convert-move-to-host-pov';

export function isMoveValid(move: MoveModel, gameState: PlayerGameStateModel) {
  const { IsHost, IsHostPlayersTurn } = gameState;
  const hostAndHostTurn = IsHostPlayersTurn && IsHost;
  const guestAndGuestTurn = !IsHostPlayersTurn && !IsHost;
  const isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;

  if (!isPlayersTurn) {
    return false;
  }

  const lane = gameState.Lanes[move.TargetLaneIndex];
  const clonedLane = _.cloneDeep(lane);
  const clonedMove = _.cloneDeep(move);

  if (!IsHost) {
    convertLaneToHostPov(clonedLane);
    convertMoveToHostPov(clonedMove);
  }

  return isMoveValidFromHostPov(clonedLane, clonedMove);
}
