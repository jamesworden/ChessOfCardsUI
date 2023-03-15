import { Move } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';

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
