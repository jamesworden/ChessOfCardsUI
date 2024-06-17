import {
  DurationOption,
  Lane,
  PlayerGameView,
  PlayerOrNone,
} from '@shared/models';

const DEFAULT_LANE: Lane = {
  LaneAdvantage: PlayerOrNone.None,
  Rows: [[], [], [], [], [], [], []],
  WonBy: PlayerOrNone.None,
};

export const DEFAULT_GAME_VIEW: PlayerGameView = {
  ChatMessages: [],
  DurationOption: DurationOption.FiveMinutes,
  GameCode: '',
  GameCreatedTimestampUTC: '',
  hand: {
    Cards: [],
  },
  HasEnded: false,
  IsHost: false,
  IsHostPlayersTurn: false,
  Lanes: [
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
    { ...DEFAULT_LANE },
  ],
  MovesMade: [],
  NumCardsInOpponentsDeck: 0,
  NumCardsInOpponentsHand: 0,
  NumCardsInPlayersDeck: 0,
  HostSecondsRemaining: 0,
  GuestSecondsRemaining: 0,
};
