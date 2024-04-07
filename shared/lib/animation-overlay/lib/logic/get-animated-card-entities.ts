import { TemplateRef } from '@angular/core';
import {
  PlayerGameView,
  PlayerOrNone,
  CardMovement,
  CardStore,
  CardPosition,
} from '@shared/models';
import {
  AnimatedEntity,
  AnimatedEntityStyles,
} from '../models/animated-entity.model';
import { AnimationType } from '../models/animation-type.model';
import { AnimatedMovement } from '../models/animated-movement.model';
import { AnimatedPosition } from '../models/animated-position.model';
import { MoveMadeDetails } from 'projects/client/src/app/views/game-view/models/move-made-details.model';
import { getCardTiltDegrees } from '@shared/logic';

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
          latestMoveMadeDetails,
          prevView,
          currView
        );

        for (const entity of animatedEntities) {
          const prevSequence = entity.movement.sequence < sequence;
          const suitMatches =
            entity.context.Card?.Suit === cardMovement.Card?.Suit;
          const kindMatches =
            entity.context.Card?.Kind === cardMovement.Card?.Kind;

          if (
            entity.context.Card &&
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
  prevView: PlayerGameView,
  currView: PlayerGameView,
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

  const beforeRotation =
    cardMovement.Card &&
    typeof cardMovement.From.CardPosition?.RowIndex === 'number'
      ? getCardTiltDegrees(
          cardMovement.Card,
          cardMovement.From.CardPosition?.RowIndex,
          isHost,
          cardMovement.From.CardPosition?.LaneIndex
            ? prevView.Lanes[cardMovement.From.CardPosition?.LaneIndex]
                .LaneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  const afterRotation =
    cardMovement.Card &&
    typeof cardMovement.To.CardPosition?.RowIndex === 'number'
      ? getCardTiltDegrees(
          cardMovement.Card,
          cardMovement.To.CardPosition?.RowIndex,
          isHost,
          cardMovement.To.CardPosition?.LaneIndex
            ? currView.Lanes[cardMovement.To.CardPosition?.LaneIndex]
                .LaneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  const styles: AnimatedEntityStyles = {
    before: {
      rotate: `${beforeRotation}deg`,
    },
    after: {
      rotate: `${afterRotation}deg`,
    },
  };

  return {
    animationType,
    template: cardMovementTemplate,
    context: cardMovement,
    movement,
    styles,
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

  const lane = document.getElementsByTagName('game-lane')[laneIndex];
  const position = lane.getElementsByTagName('game-position')[rowIndex];

  let { x, y } = position.getBoundingClientRect();
  y += window.scrollY;

  return { x, y };
}

function getAnimatedPositionFromOpponentCardIndex(
  guestCardIndex: number,
  cardSize: number
) {
  const opponentHand = document.getElementById('opponent-hand')!;
  let { x, y } = opponentHand.getBoundingClientRect();
  y += window.scrollY;
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
  y += window.scrollY;
  x += cardSize * guestCardIndex;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromPlayerDeck() {
  const playerDeck = document.getElementsByTagName('game-face-down-card')[1];
  let { x, y } = playerDeck.getBoundingClientRect();
  y += window.scrollY;

  return {
    x,
    y,
  };
}

function getAnimatedPositionFromOpponentDeck() {
  const playerDeck = document.getElementsByTagName('game-face-down-card')[0];
  let { x, y } = playerDeck.getBoundingClientRect();
  y += window.scrollY;

  return {
    x,
    y,
  };
}
