import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { isMoveValidFromHostPov } from './is-move-valid-from-host-pov';
import * as _ from 'lodash';
import { convertLaneToHostPov } from './convert-lane-to-host-pov';
import { convertMoveToHostPov } from './convert-move-to-host-pov';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function isMoveValid(move: MoveModel, gameState: PlayerGameStateModel) {
  const { IsHost, IsHostPlayersTurn } = gameState;
  const hostAndHostTurn = IsHostPlayersTurn && IsHost;
  const guestAndGuestTurn = !IsHostPlayersTurn && !IsHost;
  const isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;

  if (!isPlayersTurn) {
    return false;
  }

  // All 'place card attempts' of a move must be in the same lane.
  const lane = gameState.Lanes[move.PlaceCardAttempts[0].TargetLaneIndex];

  if (lane.WonBy != PlayerOrNoneModel.None) {
    return false;
  }

  const clonedLane = _.cloneDeep(lane);
  const clonedMove = _.cloneDeep(move);

  if (!IsHost) {
    convertLaneToHostPov(clonedLane);
    convertMoveToHostPov(clonedMove);
  }

  return isMoveValidFromHostPov(clonedLane, clonedMove);
}
