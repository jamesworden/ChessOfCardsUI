import { Move, PlaceCardAttempt } from '@client/models';

export class MoveBuilder {
  private move: Move;

  constructor() {
    this.move = {
      PlaceCardAttempts: [],
    };
  }

  addPlaceCardAttempt(placeCardAttempt: PlaceCardAttempt) {
    this.move.PlaceCardAttempts.push(placeCardAttempt);
    return this;
  }

  build() {
    return this.move;
  }
}
