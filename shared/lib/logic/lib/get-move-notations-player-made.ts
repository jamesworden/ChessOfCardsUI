import { MoveMade, PlayerOrNone } from '@shared/models';

export interface MoveNotation {
  playedBy: PlayerOrNone;
  notations: string[][];
  displayMoveNumber?: number;
}

export function getMoveNotationsPlayerMade(
  movesMade: MoveMade[]
): MoveNotation[] {
  if (movesMade.length === 0) {
    return [];
  }

  let latestMoveIndex = 0;
  let lastPlayedBy: PlayerOrNone | undefined = undefined;

  return movesMade.map((moveMade) => {
    let displayMoveNumber = undefined;

    if (lastPlayedBy !== moveMade.PlayedBy) {
      latestMoveIndex++;
      displayMoveNumber = latestMoveIndex;
    }
    lastPlayedBy = moveMade.PlayedBy;

    const notations = moveMade.CardMovements.map((cardMovement) =>
      cardMovement
        .map(({ Notation }) => Notation as string)
        .filter((notation) => notation)
    );

    return {
      displayMoveNumber,
      notations,
      playedBy: moveMade.PlayedBy,
    };
  });
}
