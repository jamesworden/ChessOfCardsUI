import { CandidateMove, PlaceCardAttempt } from '@shared/models';

export function canPlaceMultipleCards(
  initialPlaceCardAttempt: PlaceCardAttempt,
  candidateMoves?: CandidateMove[]
) {
  return (
    candidateMoves?.some(
      (candidateMove) =>
        initialPlaceCardAttempt.Card.Kind ===
          candidateMove.Move.PlaceCardAttempts[0].Card.Kind &&
        initialPlaceCardAttempt.Card.Suit ===
          candidateMove.Move.PlaceCardAttempts[0].Card.Suit &&
        initialPlaceCardAttempt.TargetLaneIndex ===
          candidateMove.Move.PlaceCardAttempts[0].TargetLaneIndex &&
        initialPlaceCardAttempt.TargetRowIndex ===
          candidateMove.Move.PlaceCardAttempts[0].TargetRowIndex &&
        candidateMove.Move.PlaceCardAttempts.length > 1 &&
        candidateMove.IsValid
    ) ?? false
  );
}
