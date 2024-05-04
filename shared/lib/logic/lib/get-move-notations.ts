import { MoveMade, PlayerOrNone } from '@shared/models';

export interface MoveNotation {
  playedBy: PlayerOrNone;
  notations: string[][];
}

export function getMoveNotations(movesMade: MoveMade[]) {
  const moveNotations: MoveNotation[] = [];

  if (movesMade.length === 0) {
    return [];
  }

  let latestPlayedBy: PlayerOrNone | undefined = undefined;

  for (const moveMade of movesMade) {
    const treatAsApartOfLastMove = moveMade.PlayedBy === latestPlayedBy;
    if (treatAsApartOfLastMove) {
      moveNotations[moveNotations.length - 1].notations.push([]);
    } else {
      moveNotations.push({
        notations: [],
        playedBy: moveMade.PlayedBy,
      });
    }

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
