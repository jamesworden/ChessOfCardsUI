import {
  DurationOption,
  Lane,
  PlayerGameView,
  PlayerOrNone,
} from '@shared/models';

const DEFAULT_LANE: Lane = {
  laneAdvantage: PlayerOrNone.None,
  rows: [[], [], [], [], [], [], []],
  wonBy: PlayerOrNone.None,
};

export const DEFAULT_GAME_VIEW: PlayerGameView = {
  chatMessages: [],
  durationOption: DurationOption.FiveMinutes,
  gameCode: '',
  gameCreatedTimestampUTC: '',
  hand: {
    cards: [],
  },
  hasEnded: false,
  isHost: false,
  isHostPlayersTurn: false,
  lanes: [
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
  ],
  movesMade: [],
  numCardsInOpponentsDeck: 0,
  numCardsInOpponentsHand: 0,
  numCardsInPlayersDeck: 0,
  hostSecondsRemaining: 0,
  guestSecondsRemaining: 0,
};
