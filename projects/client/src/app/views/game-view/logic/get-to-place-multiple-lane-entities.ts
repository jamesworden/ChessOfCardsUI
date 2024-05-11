import { AnimatedEntity, AnimationType } from '@shared/animation-overlay';
import { getIndexOfCardInArray } from '@shared/logic';
import { Card, CardMovement, PlaceCardAttempt } from '@shared/models';
import { TemplateRef } from '@angular/core';
import { getAnimatedMovement } from './get-animated-movement';

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
  durationMs = 500
): AnimatedEntity<CardMovement> | null {
  if (!template) {
    return null;
  }

  const indexOfCardInHand = getIndexOfCardInArray(
    placeCardAttempt.Card,
    cardsInHand
  );
  if (indexOfCardInHand === null) {
    return null;
  }

  const cardMovement: CardMovement = {
    From: {
      HostHandCardIndex: isHost ? indexOfCardInHand : null,
      GuestHandCardIndex: isHost ? null : indexOfCardInHand,
      CardPosition: null,
      Destroyed: false,
      GuestDeck: false,
      HostDeck: false,
    },
    To: {
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
    Card: placeCardAttempt.Card,
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

  const entity: AnimatedEntity<CardMovement> = {
    animationType: AnimationType.Movement,
    context: cardMovement,
    movement,
    template,
  };

  return entity;
}
