import { CandidateMove, PlaceCardAttempt } from '@shared/models';

// TODO: condense boolean logic once the backend properly calculates which place multiple cards are allowed.
export function canPlaceMultipleCards(
  candidateMoves: CandidateMove[][],
  initialPlaceCardAttempt: PlaceCardAttempt
) {
  return candidateMoves[candidateMoves.length - 1].some(({ Move, IsValid }) => {
    if (
      initialPlaceCardAttempt.Card.Kind !== Move.PlaceCardAttempts[0].Card.Kind
    ) {
      return false;
    }
    if (
      initialPlaceCardAttempt.Card.Suit !== Move.PlaceCardAttempts[0].Card.Suit
    ) {
      return false;
    }
    if (
      initialPlaceCardAttempt.TargetLaneIndex !==
      Move.PlaceCardAttempts[0].TargetLaneIndex
    ) {
      return false;
    }
    if (
      initialPlaceCardAttempt.TargetRowIndex !==
      Move.PlaceCardAttempts[0].TargetRowIndex
    ) {
      return false;
    }
    return Move.PlaceCardAttempts.length > 1 && IsValid;
  });
}
