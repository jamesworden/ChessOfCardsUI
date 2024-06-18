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
  durationMs = DURATIONS.DEFAULT_CARD_ANIMATION
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
          typeof cardMovement.From.CardPosition?.LaneIndex === 'number'
            ? prevView.lanes[cardMovement.From.CardPosition?.LaneIndex]
                .LaneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  let afterRotation =
    cardMovement.Card &&
    typeof cardMovement.To.CardPosition?.RowIndex === 'number'
      ? getCardTiltDegrees(
          cardMovement.Card,
          cardMovement.To.CardPosition?.RowIndex,
          isHost,
          typeof cardMovement.To.CardPosition?.LaneIndex === 'number'
            ? currView.lanes[cardMovement.To.CardPosition?.LaneIndex]
                .LaneAdvantage
            : PlayerOrNone.None
        )
      : 0;

  if (cardMovement.To.Destroyed) {
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
