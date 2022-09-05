import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';
import { LaneModel } from 'src/app/models/lane.model';
import { MoveModel } from 'src/app/models/move.model';
import { allPreviousRowsOccupied } from './valid-move-checks/all-previous-rows-occupied';
import { cardTrumpsCard } from './valid-move-checks/card-trumps-card';
import { cardsHaveMatchingSuit } from './valid-move-checks/cards-have-matching-suit';
import { cardsHaveMatchingSuitOrKind } from './valid-move-checks/cards-have-matching-suit-or-kind';
import { getTopCardOnTargetRow } from './valid-move-checks/get-top-card-on-target-row';

export function isMoveValidFromHostPov(lane: LaneModel, move: MoveModel) {
  const { LaneAdvantage, LastCardPlayed, Rows } = lane;
  const { Card, TargetRowIndex } = move.PlaceCardAttempts[0]; // TODO: For now, assume all moves have one place card attempt.

  const targetCard = getTopCardOnTargetRow(lane, TargetRowIndex);
  const playerPlayedTargetCard =
    targetCard?.PlayedBy === PlayerOrNoneModel.Host;

  const moveIsPlayerSide = TargetRowIndex < 3;
  const moveIsMiddle = TargetRowIndex === 3;
  const moveIsOpponentSide = TargetRowIndex > 3;

  const playerHasAdvantage = LaneAdvantage === PlayerOrNoneModel.Host;
  const opponentHasAdvantage = LaneAdvantage === PlayerOrNoneModel.Guest;
  const noAdvantage = LaneAdvantage === PlayerOrNoneModel.None;

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

  // Can't reinforce with different suit card.
  if (
    targetCard &&
    playerPlayedTargetCard &&
    !cardsHaveMatchingSuit(targetCard, Card)
  ) {
    return false;
  }

  // Can't reinforce or capture a lesser card.
  if (targetCard && !cardTrumpsCard(Card, targetCard)) {
    return false;
  }

  return true;
}
