import { CardMovement } from '../../../models/card-movement.model';
import { PlayerGameView } from '../../../models/player-game-view.model';
import { AnimatedMovement } from '../components/animation-overlay/models/animated-movement.model';
import { CardStore } from '../../../models/card-store.model';
import { AnimatedPosition } from '../components/animation-overlay/models/animated-position.model';
import { CardPosition } from '../../../models/card-position.model';
import {
  AnimatedEntity,
  AnimatedEntityStyles,
} from '../components/animation-overlay/models/animated-entity.model';
import { TemplateRef } from '@angular/core';
import { AnimationType } from '../components/animation-overlay/models/animation-type.model';
import { MoveMadeDetails } from '../models/move-made-details.model';
import { getCardTiltDegrees } from './get-card-tilt-degrees';

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
          cardMovementTemplate
        );

        const wasDraggedFromPlayerHand =
          latestMoveMadeDetails?.wasDragged &&
          isFromPlayerHand(animatedEntity, currView.IsHost);

        if (wasDraggedFromPlayerHand) {
          animatedEntity.movement.durationMs = 0;
        }

        // If any animated entity card position's TO matches that of
        // a previous entities FROM, it means that we should hide
        // the previous animation at this sequence, otherwise it lingers
        // on the board.
        if (animatedEntity.context.From.CardPosition) {
          for (let i = 0; i < animatedEntities.length; i++) {
            if (
              hasMatchingCardPosition(
                animatedEntities[i].context.To.CardPosition,
                animatedEntity.context.From.CardPosition
              )
            ) {
              animatedEntities[i].movement.terminalSequence = sequence;
            }
          }
        }

        animatedEntities.push(animatedEntity);
      }
    }
  }

  return animatedEntities;
}

function isFromPlayerHand(
  animatedEntity: AnimatedEntity<CardMovement>,
  isHost: boolean
) {
  const hostHandCardIndex = animatedEntity.context.From?.HostHandCardIndex;
  const fromHostHand =
    hostHandCardIndex !== null && hostHandCardIndex !== undefined;
  const guestHandCardIndex = animatedEntity.context.From?.GuestHandCardIndex;
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
  durationMs = 500
): AnimatedEntity<CardMovement> {
  const movement = getAnimatedMovement(
    cardMovement,
    sequence,
    cardSize,
    isHost,
    durationMs
  );

  const animationValue = getAnimationValue(cardMovement);
  const animationStyles = getAnimationStyles(cardMovement, isHost);

  return {
    animationType: AnimationType.CardMovement,
    animationValue,
    template: cardMovementTemplate,
    context: cardMovement,
    movement,
    styles: animationStyles,
  };
}

function getAnimationValue(cardMovement: CardMovement) {
  if (cardMovement.From && cardMovement.To) {
    return 'movement';
  }

  if (!cardMovement.From) {
    return 'fadeIn';
  }

  if (!cardMovement.To) {
    return 'fadeOut';
  }

  return '';
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

function hasMatchingCardPosition(
  cardPosition?: CardPosition | null,
  cardPosition2?: CardPosition | null
) {
  return (
    cardPosition &&
    cardPosition2 &&
    cardPosition?.LaneIndex === cardPosition2.LaneIndex &&
    cardPosition?.RowIndex === cardPosition2.RowIndex
  );
}

function getAnimationStyles(cardMovement: CardMovement, isHost: boolean) {
  if (!cardMovement.Card) {
    return;
  }

  const toRowIndex = cardMovement.To?.CardPosition?.RowIndex;
  const toRowIndexExists = toRowIndex !== undefined;

  const animationStyles: AnimatedEntityStyles = {
    before: {
      rotate: '0',
    },
    after: {
      rotate: toRowIndexExists
        ? `${getCardTiltDegrees(cardMovement.Card, toRowIndex, isHost)}`
        : '0',
    },
  };

  return animationStyles;
}
