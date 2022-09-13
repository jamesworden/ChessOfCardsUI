import { MoveModel } from 'projects/client/src/app/models/move.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';

export class MoveBuilder {
  private move: MoveModel;

  constructor() {
    this.move = {
      PlaceCardAttempts: [],
    };
  }

  addPlaceCardAttempt(placeCardAttempt: PlaceCardAttemptModel) {
    this.move.PlaceCardAttempts.push(placeCardAttempt);
    return this;
  }

  build() {
    return this.move;
  }
}
