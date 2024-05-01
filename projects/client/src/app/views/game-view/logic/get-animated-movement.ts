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
): AnimatedPosition {
  const { LaneIndex: laneIndex, RowIndex: rowIndex } = cardPosition;

  const lane = document.getElementsByClassName('lane-animation-target')[
    laneIndex
  ];
  const position = lane.getElementsByTagName('game-position')[rowIndex];

  let { x, y } = position.getBoundingClientRect();
  // y += window.scrollY;

  return { x, y };
}

function getAnimatedPositionFromOpponentCardIndex(
  guestCardIndex: number,
  cardSize: number
) {
  const opponentHand = document.getElementById('opponent-hand')!;
  let { x, y } = opponentHand.getBoundingClientRect();
  // y += window.scrollY;
  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerCardIndex(
  guestCardIndex: number,
  cardSize: number
) {
  const playerHand = document.getElementById('player-hand')!;
  let { x, y } = playerHand.getBoundingClientRect();
  // y += window.scrollY;
  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerDeck() {
  const playerDeck = document.getElementsByTagName('game-face-down-card')[1];
  let { x, y } = playerDeck.getBoundingClientRect();
  // y += window.scrollY;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromOpponentDeck() {
  const playerDeck = document.getElementsByTagName('game-face-down-card')[0];
  let { x, y } = playerDeck.getBoundingClientRect();
  // y += window.scrollY;

  return {
    x,
    y,
  };
}
