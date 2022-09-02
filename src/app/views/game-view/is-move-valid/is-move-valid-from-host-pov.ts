import { LaneAdvantageModel } from 'src/app/models/lane-advantage.model';
import { LaneModel } from 'src/app/models/lane.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayedByModel } from 'src/app/models/played-by.model';
import { allPreviousRowsOccupied } from './valid-move-checks/all-previous-rows-occupied';
import { cardsHaveMatchingSuit } from './valid-move-checks/cards-have-matching-suit';
import { cardsHaveMatchingSuitOrKind } from './valid-move-checks/cards-have-matching-suit-or-kind';
import { getTopCardOnTargetRow } from './valid-move-checks/get-top-card-on-target-row';

export function isMoveValidFromHostPov(lane: LaneModel, move: MoveModel) {
  const { LaneAdvantage, LastCardPlayed, Rows } = lane;
  const { Card, TargetRowIndex } = move.PlaceCardAttempts[0]; // TODO: For now, assume all moves have one place card attempt.

  const targetCard = getTopCardOnTargetRow(lane, TargetRowIndex);
  const playerPlayedTargetCard = targetCard?.PlayedBy === PlayedByModel.Host;

  const moveIsPlayerSide = TargetRowIndex < 3;
  const moveIsMiddle = TargetRowIndex === 3;
  const moveIsOpponentSide = TargetRowIndex > 3;

  const playerHasAdvantage = LaneAdvantage === LaneAdvantageModel.Host;
  const opponentHasAdvantage = LaneAdvantage === LaneAdvantageModel.Guest;
  const noAdvantage = LaneAdvantage === LaneAdvantageModel.None;

  if (moveIsMiddle) {
    return false;
  }

  if (moveIsPlayerSide && playerHasAdvantage) {
    return false;
  }

  if (moveIsOpponentSide && opponentHasAdvantage) {
    return false;
  }

  if (moveIsOpponentSide && noAdvantage) {
    return false;
  }

  if (moveIsPlayerSide && !allPreviousRowsOccupied(lane, TargetRowIndex)) {
    return false;
  }

  if (LastCardPlayed && !cardsHaveMatchingSuitOrKind(Card, LastCardPlayed)) {
    return false;
  }

  if (
    targetCard &&
    playerPlayedTargetCard &&
    !cardsHaveMatchingSuit(targetCard, Card)
  ) {
    return false;
  }

  return true;
}
