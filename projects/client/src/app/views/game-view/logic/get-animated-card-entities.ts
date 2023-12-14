import { CardMovement } from '../../../models/card-movement.model';
import { PlayerGameView } from '../../../models/player-game-view.model';
import { AnimatedMovement } from '../components/animation-overlay/models/animated-movement.model';
import { CardStore } from '../../../models/card-store.model';
import { AnimatedPosition } from '../components/animation-overlay/models/animated-position.model';
import { CardPosition } from '../../../models/card-position.model';
import { AnimatedEntity } from '../components/animation-overlay/models/animated-entity.model';
import { TemplateRef } from '@angular/core';
import { AnimationType } from '../components/animation-overlay/models/animation-type.model';
import { MoveMadeDetails } from '../models/move-made-details.model';

export function getAnimatedCardEntities(
  prevAndCurrGameViews: [PlayerGameView | null, PlayerGameView | null],
  cardSize: number,
  cardMovementTemplate: TemplateRef<CardMovement> | null,
  latestMoveMadeDetails: MoveMadeDetails | null
): AnimatedEntity<CardMovement>[] {
  const [prevView, currView] = prevAndCurrGameViews;

  if (!prevView || !currView || !cardMovementTemplate) {
    return [];
  }

  const numLastMovesToProcess =
    currView.MovesMade.length - prevView.MovesMade.length;

  if (numLastMovesToProcess <= 0) {
    return [];
  }

  let animatedEntities: AnimatedEntity<CardMovement>[] = [];

  for (
    let i = currView.MovesMade.length - numLastMovesToProcess;
    i < currView.MovesMade.length;
    i++
  ) {
    const { CardMovements } = currView.MovesMade[i];

    for (let sequence = 0; sequence < CardMovements.length; sequence++) {
      for (const cardMovement of CardMovements[sequence]) {
        const animatedEntity = getAnimatedEntity(
          cardMovement,
          sequence,
          currView.IsHost,
          cardSize,
          cardMovementTemplate,
          latestMoveMadeDetails
        );

        for (const entity of animatedEntities) {
          const prevSequence = entity.movement.sequence < sequence;
          const suitMatches =
            entity.context.Card?.Suit === cardMovement.Card?.Suit;
          const kindMatches =
            entity.context.Card?.Kind === cardMovement.Card?.Kind;

          if (
            prevSequence &&
            suitMatches &&
            kindMatches &&
            !entity.movement.terminalSequence
          ) {
            entity.movement.terminalSequence = sequence;
          }
        }

        animatedEntities.push(animatedEntity);
      }
    }
  }

  return animatedEntities;
}

function isFromPlayerHand(cardMovement: CardMovement, isHost: boolean) {
  const hostHandCardIndex = cardMovement.From?.HostHandCardIndex;
  const fromHostHand =
    hostHandCardIndex !== null && hostHandCardIndex !== undefined;
  const guestHandCardIndex = cardMovement.From?.GuestHandCardIndex;
  const fromGuestHand =
    guestHandCardIndex !== null && guestHandCardIndex !== undefined;
  const isHostAndFromHostHand = isHost && fromHostHand && true;
  const isGuestAndFromGuestHand = !isHost && fromGuestHand && true;

  return isHostAndFromHostHand || isGuestAndFromGuestHand;
}

function getAnimatedEntity(
  cardMovement: CardMovement,
  sequence: number,
  isHost: boolean,
  cardSize: number,
  cardMovementTemplate: TemplateRef<CardMovement>,
  latestMoveMadeDetails: MoveMadeDetails | null,
  durationMs = 500
): AnimatedEntity<CardMovement> {
  const movement = getAnimatedMovement(
    cardMovement,
    sequence,
    cardSize,
    isHost,
    durationMs
  );

  let animationType = cardMovement.To.Destroyed
    ? AnimationType.FadeOut
    : AnimationType.CardMovement;

  const wasDraggedFromPlayerHand =
    latestMoveMadeDetails?.wasDragged && isFromPlayerHand(cardMovement, isHost);

  if (wasDraggedFromPlayerHand) {
    const toGuestSideAndIsHost =
      (cardMovement.To.CardPosition?.RowIndex ?? 3) > 3 && isHost;
    const toHostSideAndIsGuest =
      (cardMovement.To.CardPosition?.RowIndex ?? 3) < 3 && !isHost;
    const ontoOpposingSide = toGuestSideAndIsHost || toHostSideAndIsGuest;

    if (ontoOpposingSide) {
      animationType = AnimationType.FadeIn;
    } else {
      movement.durationMs = 0;
    }
  }

  return {
    animationType,
    template: cardMovementTemplate,
    context: cardMovement,
    movement,
  };
}

function getAnimatedMovement(
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

  const lane = document.getElementsByTagName('app-lane')[laneIndex];
  const position = lane.getElementsByTagName('app-position')[rowIndex];

  const { x, y } = position.getBoundingClientRect();

  return { x, y };
}

function getAnimatedPositionFromOpponentCardIndex(
  guestCardIndex: number,
  cardSize: number
) {
  const opponentHand = document.getElementById('opponent-hand')!;
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
) {
  const playerHand = document.getElementById('player-hand')!;
  let { x, y } = playerHand.getBoundingClientRect();

  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerDeck() {
  const playerDeck = document.getElementsByTagName('app-face-down-card')[1];
  const { x, y } = playerDeck.getBoundingClientRect();

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromOpponentDeck() {
  const playerDeck = document.getElementsByTagName('app-face-down-card')[0];
  const { x, y } = playerDeck.getBoundingClientRect();

  return {
    x,
    y,
  };
}
