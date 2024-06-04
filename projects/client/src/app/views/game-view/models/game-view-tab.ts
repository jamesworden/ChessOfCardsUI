/**
 * On mobile, these different tabs should all be viable options for selection.
 * On Desktop, only the `BoardWithStatsPanel` should be rendered. This way, the
 * other 'tabs' can be selected within the rendered "stats panel".
 */
export enum GameViewTab {
  NewGame = 'new-game',
  Moves = 'moves',
  BoardWithStatsPanel = 'board-with-stats-panel',
  Chat = 'chat',
}
