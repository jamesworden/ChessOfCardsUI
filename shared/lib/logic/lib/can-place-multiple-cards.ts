import { CandidateMove, PlaceCardAttempt } from '@shared/models';

export function canPlaceMultipleCards(
  initialPlaceCardAttempt: PlaceCardAttempt,
  candidateMoves?: CandidateMove[]
) {
  return (
    candidateMoves?.some(
      (candidateMove) =>
        initialPlaceCardAttempt.card.kind ===
          candidateMove.move.placeCardAttempts[0].card.kind &&
        initialPlaceCardAttempt.card.suit ===
          candidateMove.move.placeCardAttempts[0].card.suit &&
        initialPlaceCardAttempt.targetLaneIndex ===
          candidateMove.move.placeCardAttempts[0].targetLaneIndex &&
        initialPlaceCardAttempt.targetRowIndex ===
          candidateMove.move.placeCardAttempts[0].targetRowIndex &&
        candidateMove.move.placeCardAttempts.length > 1 &&
        candidateMove.isValid
    ) ?? false
  );
}
