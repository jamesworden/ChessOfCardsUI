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

// export function getMoveNotations(movesMade: MoveMade[]) {
//   const moveNotations: MoveNotation[] = [];

//   if (movesMade.length === 0) {
//     return [];
//   }

//   let latestPlayedBy: PlayerOrNone | undefined = undefined;

//   for (const moveMade of movesMade) {
//     if (moveMade.PlayedBy === latestPlayedBy) {
//       const nextLineOfNotations: string[] = [];

//       for (const cardMovementGroup of moveMade.CardMovements) {
//         for (const cardMovement of cardMovementGroup) {
//           if (cardMovement.Notation) {
//             nextLineOfNotations.push(cardMovement.Notation);
//           }
//         }
//       }

//       if (nextLineOfNotations.length > 0) {
//         moveNotations[moveNotations.length - 1].notations.push(
//           nextLineOfNotations
//         );
//       }
//     } else {
//       const moveNotation: MoveNotation = {
//         notations: [],
//         playedBy: moveMade.PlayedBy,
//       };

//       for (const cardMovementGroup of moveMade.CardMovements) {
//         const nextMoveNotations: string[] = [];

//         for (const cardMovement of cardMovementGroup) {
//           if (cardMovement.Notation) {
//             nextMoveNotations.push(cardMovement.Notation);
//           }
//         }

//         if (nextMoveNotations.length > 0) {
//           moveNotation.notations.push(nextMoveNotations);
//         }
//       }

//       moveNotations.push(moveNotation);
//     }

//     latestPlayedBy = moveMade.PlayedBy;
//   }

//   return moveNotations;
// }

// export function getMoveNotationsPlayerMade(
//   movesMade: MoveMade[]
// ): MoveNotation[] {
//   if (movesMade.length === 0) {
//     return [];
//   }

//   let latestMoveIndex = 0;
//   let lastPlayedBy: PlayerOrNone | undefined = undefined;

//   return movesMade.map((moveMade) => {
//     let displayMoveNumber = undefined;

//     if (lastPlayedBy !== moveMade.PlayedBy) {
//       latestMoveIndex++;
//       displayMoveNumber = latestMoveIndex;
//     }
//     lastPlayedBy = moveMade.PlayedBy;

//     const notations = moveMade.CardMovements.map((cardMovement) =>
//       cardMovement
//         .map(({ Notation }) => Notation as string)
//         .filter((notation) => notation)
//     );

//     return {
//       displayMoveNumber,
//       notations,
//       playedBy: moveMade.PlayedBy,
//     };
//   });
// }
