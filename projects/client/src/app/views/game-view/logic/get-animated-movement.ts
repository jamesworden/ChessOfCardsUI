import { AnimatedMovement, AnimatedPosition } from '@shared/animation-overlay';
import { CardMovement, CardPosition, CardStore } from '@shared/models';

export function getAnimatedMovement(
  { From, To }: CardMovement,
  sequence: number,
  cardSize: number,
  isHost: boolean,
  durationMs: number
): AnimatedMovement {
  const from = getAnimatedPosition(From, isHost, cardSize) ?? undefined;
  const to = getAnimatedPosition(To, isHost, cardSize) ?? undefined;

  return {
    from,
    to,
    sequence,
    durationMs,
  };
}

function getAnimatedPosition(
  cardStore: CardStore | null | undefined,
  isHost: boolean,
  cardSize: number
): AnimatedPosition | null | undefined {
  if (!cardStore) {
    return null;
  }

  if (cardStore.CardPosition) {
    return getAnimatedPositionFromCardPosition(cardStore.CardPosition);
  }

  if (cardStore.Destroyed) {
    return null;
  }

  if (typeof cardStore.GuestHandCardIndex === 'number') {
    return isHost
      ? getAnimatedPositionFromOpponentCardIndex(
          cardStore.GuestHandCardIndex,
          cardSize
        )
      : getAnimatedPositionFromPlayerCardIndex(
          cardStore.GuestHandCardIndex,
          cardSize
        );
  }

  if (typeof cardStore.HostHandCardIndex === 'number') {
    return isHost
      ? getAnimatedPositionFromPlayerCardIndex(
          cardStore.HostHandCardIndex,
          cardSize
        )
      : getAnimatedPositionFromOpponentCardIndex(
          cardStore.HostHandCardIndex,
          cardSize
        );
  }

  if (cardStore.HostDeck) {
    return isHost
      ? getAnimatedPositionFromPlayerDeck()
      : getAnimatedPositionFromOpponentDeck();
  }

  if (cardStore.GuestDeck) {
    return isHost
      ? getAnimatedPositionFromOpponentDeck()
      : getAnimatedPositionFromPlayerDeck();
  }

  return null;
}

function getAnimatedPositionFromCardPosition(
  cardPosition: CardPosition
): AnimatedPosition | null {
  const { LaneIndex: laneIndex, RowIndex: rowIndex } = cardPosition;

  const lane = document.getElementsByClassName('lane-animation-target')[
    laneIndex
  ];
  if (!lane) {
    return null;
  }

  const position = lane.getElementsByTagName('game-position')[rowIndex];
  if (!position) {
    return null;
  }

  let { x, y } = position.getBoundingClientRect();

  return { x, y };
}

function getAnimatedPositionFromOpponentCardIndex(
  guestCardIndex: number,
  cardSize: number
): AnimatedPosition | null {
  const opponentHand = document.getElementById('opponent-hand')!;
  if (!opponentHand) {
    return null;
  }

  let { x, y } = opponentHand.getBoundingClientRect();
  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerCardIndex(
  guestCardIndex: number,
  cardSize: number
): AnimatedPosition | null {
  const playerHand = document.getElementById('player-hand')!;
  if (!playerHand) {
    return null;
  }

  let { x, y } = playerHand.getBoundingClientRect();
  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerDeck(): AnimatedPosition | null {
  const sidebar = document.getElementsByTagName('app-sidebar')[0];
  if (!sidebar) {
    return null;
  }

  const faceDownCards = sidebar.getElementsByTagName('game-face-down-card');
  if (faceDownCards.length === 0) {
    return null;
  }

  // Starting with the last face down card in the sidebar, return the first card
  // dimensions that aren't hidden (or has height or width).
  for (let i = faceDownCards.length - 1; i >= 0; i--) {
    const faceDownCard = faceDownCards[i];
    const clientRect = faceDownCard?.getBoundingClientRect();

    if (clientRect.width > 0 && clientRect.height > 0) {
      return {
        x: clientRect.x,
        y: clientRect.y,
      };
    }
  }

  return {
    x: 0,
    y: 0,
  };
}

function getAnimatedPositionFromOpponentDeck(): AnimatedPosition | null {
  const sidebar = document.getElementsByTagName('app-sidebar')[0];
  if (!sidebar) {
    return null;
  }

  const playerDeck = sidebar.getElementsByTagName('game-face-down-card')[0];
  if (!playerDeck) {
    return null;
  }

  if (!playerDeck) {
    return {
      x: 0,
      y: 0,
    };
  }

  let { x, y } = playerDeck.getBoundingClientRect();

  return {
    x,
    y,
  };
}
