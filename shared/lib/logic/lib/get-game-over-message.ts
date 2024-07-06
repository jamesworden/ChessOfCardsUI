import { GameOverReason, PlayerOrNone } from '@shared/models';

export function getGameOverMessage(
  gameOverReason: GameOverReason,
  isHost: boolean,
  wonBy: PlayerOrNone
) {
  const playerWon =
    (isHost && wonBy === PlayerOrNone.Host) ||
    (!isHost && wonBy === PlayerOrNone.Guest);

  switch (gameOverReason) {
    case GameOverReason.DrawByAgreement:
      return 'The game ended in a draw.';
    case GameOverReason.Disconnected:
      return `The game ended because ${playerWon ? 'your opponent' : 'you'} disconnected.`;
    case GameOverReason.Won:
      return playerWon ? 'You won!' : 'Your opponent won.';
    case GameOverReason.Resigned:
      return `${playerWon ? 'Your opponent' : 'You'} resigned.`;
    case GameOverReason.RanOutOfTime:
      return `The game ended because ${playerWon ? 'your opponent' : 'you'} ran out of time.`;
    case GameOverReason.DrawByRepetition:
      return 'The game ended in a draw by repetition.';
    default:
      return 'The game ended for an unknown reason.';
  }
}
