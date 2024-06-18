import { AnimatedEntity, AnimationType } from '@shared/animation-overlay';
import { getIndexOfCardInArray } from '@shared/logic';
import { Card, CardMovement, PlaceCardAttempt } from '@shared/models';
import { TemplateRef } from '@angular/core';
import { getAnimatedMovement } from './get-animated-movement';
import { DURATIONS } from '@shared/constants';
import { getCardMovementSoundPaths } from './get-card-movement-sound-paths';

export function gettoPmcLaneEntities(
  placeCardAttempts: PlaceCardAttempt[],
  cardsInHand: Card[],
  isHost: boolean,
  template: TemplateRef<CardMovement> | null,
  cardSize: number,
  wasDragged = false
): AnimatedEntity<CardMovement>[] {
  return placeCardAttempts
    .map(
      (placeCardAttempt, i) =>
        getAnimatedEntity(
          placeCardAttempt,
          cardsInHand,
          isHost,
          i,
          template,
          cardSize,
          wasDragged
        ) as AnimatedEntity<CardMovement>
    )
    .filter((animatedEntity) => !!animatedEntity);
}

function getAnimatedEntity(
  placeCardAttempt: PlaceCardAttempt,
  cardsInHand: Card[],
  isHost: boolean,
  sequence: number,
  template: TemplateRef<CardMovement> | null,
  cardSize: number,
  wasDragged: boolean,
  durationMs: number = DURATIONS.DEFAULT_CARD_ANIMATION
): AnimatedEntity<CardMovement> | null {
  if (!template) {
    return null;
  }

  const indexOfCardInHand = getIndexOfCardInArray(
    placeCardAttempt.card,
    cardsInHand
  );
  if (indexOfCardInHand === null) {
    return null;
  }

  const cardMovement: CardMovement = {
    from: {
      hostHandCardIndex: isHost ? indexOfCardInHand : null,
      guestHandCardIndex: isHost ? null : indexOfCardInHand,
      cardPosition: null,
      destroyed: false,
      guestDeck: false,
      hostDeck: false,
    },
    to: {
      cardPosition: {
        laneIndex: placeCardAttempt.targetLaneIndex,
        rowIndex: placeCardAttempt.targetRowIndex,
      },
      hostHandCardIndex: null,
      guestHandCardIndex: null,
      destroyed: false,
      guestDeck: false,
      hostDeck: false,
    },
    card: placeCardAttempt.card,
  };

  if (wasDragged) {
    durationMs = 0;
  }

  const movement = getAnimatedMovement(
    cardMovement,
    sequence,
    cardSize,
    isHost,
    durationMs
  );

  const soundPaths = getCardMovementSoundPaths(cardMovement, durationMs);

  const entity: AnimatedEntity<CardMovement> = {
    animationType: AnimationType.Movement,
    context: cardMovement,
    movement,
    template,
    soundPaths,
  };

  return entity;
}
