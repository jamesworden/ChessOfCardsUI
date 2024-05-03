import { MoveMade, PlayerOrNone } from '@shared/models';

export interface MoveNotation {
  playedBy: PlayerOrNone;
  notations: string[][];
  moveIndex: number;
}

export function getMoveNotationsPlayerMade(
  movesMade: MoveMade[]
): MoveNotation[] {
  return movesMade.map((moveMade, i) => {
    const notations = moveMade.CardMovements.map((cardMovement) =>
      cardMovement
        .map(({ Notation }) => Notation as string)
        .filter((notation) => notation)
    );

    return {
      moveIndex: i,
      notations,
      playedBy: moveMade.PlayedBy,
    };
  });
}
