import { LaneAdvantageModel } from 'src/app/models/lane-advantage.model';
import { LaneModel } from 'src/app/models/lane.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayedByModel } from 'src/app/models/played-by.model';
import { allPreviousRowsOccupied } from './valid-move-checks';
import { cardsHaveMatchingSuitOrKind } from './valid-move-checks/cards-have-matching-suit-or-kind';
import { getTopCardOnTargetRow } from './valid-move-checks/get-top-card-on-target-row';

export function isMoveValidFromPlayerPov(lane: LaneModel, move: MoveModel) {
  const { LaneAdvantage, LastCardPlayed, Rows } = lane;
  const { Card, TargetRowIndex } = move;

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

  // Can't reinforce with different suit
  if (targetCard && playerPlayedTargetCard && targetCard.Suit != Card.Suit) {
    return false;
  }

  return true;
}

// if (noCardsInLane) {
//   return TargetRowIndex === 0
// } else {
//   return cardsHaveMatchingSuitOrKind(Card, LastCardPlayed!) && allPreviousRowsOccupied(lane, TargetRowIndex) &&
// }
