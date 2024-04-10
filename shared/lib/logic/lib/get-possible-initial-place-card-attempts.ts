import { CandidateMove } from '@shared/models';

export function getPossibleInitialPlaceCardAttempts(
  candidateMoves?: CandidateMove[]
) {
  return (
    candidateMoves
      ?.filter((candidateMove) => {
        const isInitialAttempt =
          candidateMove.Move.PlaceCardAttempts.length === 1;
        return isInitialAttempt && candidateMove.IsValid;
      })
      .map((candidateMove) => candidateMove.Move.PlaceCardAttempts[0]) ?? []
  );
}
