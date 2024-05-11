import { AnimatedEntity, AnimationType } from '@shared/animation-overlay';
import { Card, CardMovement, PlaceCardAttempt } from '@shared/models';
import { TemplateRef } from '@angular/core';
import { getAnimatedMovement } from './get-animated-movement';

export function getfromPmcLaneEntities(
  placeCardAttempts: PlaceCardAttempt[],
  isHost: boolean,
  template: TemplateRef<CardMovement> | null,
  cardSize: number,
  existingCardsInHand: Card[]
): AnimatedEntity<CardMovement>[] {
  return placeCardAttempts
    .map(
      (placeCardAttempt, i) =>
        getAnimatedEntity(
          placeCardAttempt,
          isHost,
          template,
          cardSize,
          existingCardsInHand,
          i
        ) as AnimatedEntity<CardMovement>
    )
    .filter((animatedEntity) => !!animatedEntity);
}

function getAnimatedEntity(
  placeCardAttempt: PlaceCardAttempt,
  isHost: boolean,
  template: TemplateRef<CardMovement> | null,
  cardSize: number,
  existingCardsInHand: Card[],
  additionalCardIndex: number,
  durationMs = 500
): AnimatedEntity<CardMovement> | null {
  if (!template) {
    return null;
  }

  const toHandIndex = existingCardsInHand.length + additionalCardIndex;

  const cardMovement: CardMovement = {
    From: {
      CardPosition: {
        LaneIndex: placeCardAttempt.TargetLaneIndex,
        RowIndex: placeCardAttempt.TargetRowIndex,
      },
      HostHandCardIndex: null,
      GuestHandCardIndex: null,
      Destroyed: false,
      GuestDeck: false,
      HostDeck: false,
    },
    To: {
      CardPosition: null,
      HostHandCardIndex: isHost ? toHandIndex : null,
      GuestHandCardIndex: isHost ? null : toHandIndex,
      Destroyed: false,
      GuestDeck: false,
      HostDeck: false,
    },
    Card: placeCardAttempt.Card,
  };

  const movement = getAnimatedMovement(
    cardMovement,
    0,
    cardSize,
    isHost,
    durationMs
  );

  const entity: AnimatedEntity<CardMovement> = {
    animationType: AnimationType.Movement,
    context: cardMovement,
    movement,
    template,
  };

  return entity;
}
