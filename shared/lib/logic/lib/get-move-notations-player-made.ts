import {
  CardMovement,
  CardPosition,
  Kind,
  MoveMade,
  PlayerOrNone,
  Suit,
} from '@shared/models';
import { getPositionNotation } from './get-position-notation';

export interface MoveNotation {
  playedBy: PlayerOrNone;
  notations: string[][];
  moveIndex: number;
}

export function getMoveNotationsPlayerMade(
  movesMade: MoveMade[],
  isHost: boolean
): MoveNotation[] {
  // only show moves that are from the player hand
  return movesMade.map((moveMade, i) => {
    const notations = getMoveNotations(moveMade.CardMovements, isHost);
    return {
      moveIndex: i,
      notations,
      playedBy: moveMade.PlayedBy,
    };
  });
}

function getMoveNotations(
  cardMovements: CardMovement[][],
  isHost: boolean
): string[][] {
  const moveNotatations: string[][] = [];

  for (const movements of cardMovements) {
    const notationGroup: string[] = [];

    for (const movement of movements) {
      const notation = getMoveNotation(movement, isHost);
      if (notation) {
        notationGroup.push(notation);
      }
    }

    moveNotatations.push(notationGroup);
  }

  return moveNotatations;
}

function getMoveNotation(
  cardMovement: CardMovement,
  isHost: boolean
): string | null {
  const isHostFromHostHand =
    isHost && cardMovement.From.HostHandCardIndex !== null;
  const isGuestFromGuestHand =
    !isHost && cardMovement.From.GuestHandCardIndex !== null;
  const fromPlayerHand = isHostFromHostHand || isGuestFromGuestHand;
  if (!fromPlayerHand) {
    return null;
  }

  const { Card, To } = cardMovement;
  if (!Card) {
    return null;
  }

  if (!To.CardPosition) {
    return null;
  }

  const positionNotation = getPositionNotation(To.CardPosition);
  const kindLetter = getKindLetter(Card.Kind);
  const suitLetter = getSuitLetter(Card.Suit);

  return `${kindLetter}${suitLetter}${positionNotation}`;
}

function getKindLetter(kind: Kind) {
  switch (kind) {
    case Kind.Ace:
      return 'a';
    case Kind.Two:
      return '2';
    case Kind.Three:
      return '3';
    case Kind.Four:
      return '4';
    case Kind.Five:
      return '5';
    case Kind.Six:
      return '6';
    case Kind.Seven:
      return '7';
    case Kind.Eight:
      return '8';
    case Kind.Nine:
      return '9';
    case Kind.Ten:
      return '10';
    case Kind.Jack:
      return 'j';
    case Kind.Queen:
      return 'q';
    case Kind.King:
      return 'k';
  }
}

function getSuitLetter(suit: Suit) {
  switch (suit) {
    case Suit.Clubs:
      return 'c';
    case Suit.Diamonds:
      return 'd';
    case Suit.Hearts:
      return 'h';
    case Suit.Spades:
      return 's';
  }
}
