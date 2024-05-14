import { MoveMade, PlayerOrNone } from '@shared/models';

export interface MoveNotation {
  playedBy: PlayerOrNone;
  notations: string[][];
  displayIndex: number | null;
  isSelected: boolean;
  playedByPlayer: boolean;
}

export function getMoveNotations(
  movesMade: MoveMade[],
  isHost: boolean,
  selectedNotationIndex: number
) {
  const moveNotations: MoveNotation[] = [];

  if (movesMade.length === 0) {
    return [];
  }

  let latestPlayedBy: PlayerOrNone | undefined = undefined;
  let latestIndex = 0;

  for (let i = 0; i < movesMade.length; i++) {
    const moveMade = movesMade[i];

    let displayIndex: number | null = null;
    if (moveMade.PlayedBy !== latestPlayedBy) {
      latestIndex++;
      displayIndex = latestIndex;
    }

    const hostAndPlayedByHost =
      isHost && moveMade.PlayedBy === PlayerOrNone.Host;
    const guestAndPlayedByGuest =
      !isHost && moveMade.PlayedBy === PlayerOrNone.Guest;

    moveNotations.push({
      notations: [],
      playedBy: moveMade.PlayedBy,
      displayIndex,
      isSelected: selectedNotationIndex === i,
      playedByPlayer: hostAndPlayedByHost || guestAndPlayedByGuest,
    });

    moveNotations[moveNotations.length - 1].notations.push(
      getNotationGroup(moveMade)
    );

    latestPlayedBy = moveMade.PlayedBy;
  }

  return moveNotations;
}

function getNotationGroup(moveMade: MoveMade) {
  const notationGroup: string[] = [];

  for (const cardMovementGroup of moveMade.CardMovements) {
    for (const cardMovement of cardMovementGroup) {
      if (cardMovement.Notation) {
        notationGroup.push(cardMovement.Notation);
      }
    }
  }
  return notationGroup;
}
