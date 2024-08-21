import { TemplateRef } from '@angular/core';
import { PlayerGameView, PlayerOrNone, CardMovement } from '@shared/models';
import { getCardTiltDegrees } from '@shared/logic';
import { MoveMadeDetails } from '../models/move-made-details.model';
import {
  AnimatedEntity,
  AnimatedEntityStyles,
  AnimationType,
} from '@shared/animation-overlay';
import { getAnimatedMovement } from './get-animated-movement';
import { DURATIONS } from '@shared/constants';
import { getCardMovementSoundPaths } from './get-card-movement-sound-paths';

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
    currView.movesMade.length - prevView.movesMade.length;

  if (numLastMovesToProcess <= 0) {
    return [];
  }

  let animatedEntities: AnimatedEntity<CardMovement>[] = [];

  for (
    let i = currView.movesMade.length - numLastMovesToProcess;
    i < currView.movesMade.length;
    i++
  ) {
    const { cardMovements: CardMovements } = currView.movesMade[i];

    for (let sequence = 0; sequence < CardMovements.length; sequence++) {
      for (const cardMovement of CardMovements[sequence]) {
        const animatedEntity = getAnimatedEntity(
          cardMovement,
          sequence,
          currView.isHost,
          cardSize,
          cardMovementTemplate,
          latestMoveMadeDetails,
          prevView,
          currView
        );

        for (const entity of animatedEntities) {
          const prevSequence = entity.movement.sequence < sequence;
          const suitMatches =
            entity.context.card?.suit === cardMovement.card?.suit;
          const kindMatches =
            entity.context.card?.kind === cardMovement.card?.kind;

          if (
            entity.context.card &&
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
  const hostHandCardIndex = cardMovement.from?.hostHandCardIndex;
  const fromHostHand =
    hostHandCardIndex !== null && hostHandCardIndex !== undefined;
  const guestHandCardIndex = cardMovement.from?.guestHandCardIndex;
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
  durationMs = DURATIONS.DEFAULT_CARD_ANIMATION
): AnimatedEntity<CardMovement> {
  const movement = getAnimatedMovement(
    cardMovement,
    sequence,
    cardSize,
    isHost,
    durationMs
  );

  let animationType = cardMovement.to.destroyed
    ? AnimationType.FadeOut
    : AnimationType.Movement;

  if (movement.to && !movement.from) {
    animationType = AnimationType.FadeIn;
  } else if (!movement.to && movement.from) {
    animationType = AnimationType.FadeOut;
  }

  const wasDraggedFromPlayerHand =
    (latestMoveMadeDetails?.wasDragged ||
      latestMoveMadeDetails?.wasPlacingMultipleCards) &&
    isFromPlayerHand(cardMovement, isHost);

  if (wasDraggedFromPlayerHand) {
    const toGuestSideAndIsHost =
      (cardMovement.to.cardPosition?.rowIndex ?? 3) > 3 && isHost;
    const toHostSideAndIsGuest =
      (cardMovement.to.cardPosition?.rowIndex ?? 3) < 3 && !isHost;
    const ontoOpposingSide = toGuestSideAndIsHost || toHostSideAndIsGuest;

    if (ontoOpposingSide) {
      animationType = AnimationType.FadeIn;
    } else {
      movement.durationMs = 0;
    }
  }

  const beforeRotation =
    cardMovement.card &&
    typeof cardMovement.from.cardPosition?.rowIndex === 'number'
      ? getCardTiltDegrees(
          cardMovement.card,
          cardMovement.from.cardPosition?.rowIndex,
          isHost,
          typeof cardMovement.from.cardPosition?.laneIndex === 'number'
            ? prevView.lanes[cardMovement.from.cardPosition?.laneIndex]
                .laneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  let afterRotation =
    cardMovement.card &&
    typeof cardMovement.to.cardPosition?.rowIndex === 'number'
      ? getCardTiltDegrees(
          cardMovement.card,
          cardMovement.to.cardPosition?.rowIndex,
          isHost,
          typeof cardMovement.to.cardPosition?.laneIndex === 'number'
            ? currView.lanes[cardMovement.to.cardPosition?.laneIndex]
                .laneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  if (cardMovement.to.destroyed) {
    afterRotation = beforeRotation;
  }

  const styles: AnimatedEntityStyles = {
    before: {
      rotate: `${beforeRotation}deg`,
    },
    after: {
      rotate: `${afterRotation}deg`,
    },
  };

  const soundPaths = getCardMovementSoundPaths(cardMovement, durationMs);

  return {
    animationType,
    template: cardMovementTemplate,
    context: cardMovement,
    movement,
    styles,
    soundPaths,
  };
}
