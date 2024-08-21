import { CandidateMove } from '@shared/models';

export function getPossibleInitialPlaceCardAttempts(
  candidateMoves?: CandidateMove[]
) {
  return (
    candidateMoves
      ?.filter((candidateMove) => {
        const isInitialAttempt =
          candidateMove.move.placeCardAttempts.length === 1;
        return isInitialAttempt && candidateMove.isValid;
      })
      .map((candidateMove) => candidateMove.move.placeCardAttempts[0]) ?? []
  );
}
