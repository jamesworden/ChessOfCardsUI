import { DurationOption } from '../models/duration-option.model';
import { Kind } from '../models/kind.model';
import { PlayerGameView } from '../models/player-game-view.model';
import { PlayerOrNone } from '../models/player-or-none.model';
import { Suit } from '../models/suit.model';

export const DEMO_PLAYER_GAME_VIEW: PlayerGameView = {
  DurationOption: DurationOption.FiveMinutes,
  GameCreatedTimestampUTC: '',
  Hand: {
    Cards: [],
  },
  IsHost: true,
  IsHostPlayersTurn: true,
  Lanes: [
    {
      LaneAdvantage: PlayerOrNone.None,
      Rows: [
        [
          {
            Kind: Kind.Ace,
            PlayedBy: PlayerOrNone.None,
            Suit: Suit.Spades,
            customStyles: {
              opacity: '.1',
            },
          },
        ],
        [
          {
            Kind: Kind.Seven,
            PlayedBy: PlayerOrNone.None,
            Suit: Suit.Diamonds,
            customStyles: {
              opacity: '.2',
            },
          },
        ],
        [],
        [],
        [],
        [
          {
            Kind: Kind.Queen,
            PlayedBy: PlayerOrNone.None,
            Suit: Suit.Diamonds,
            customStyles: {
              opacity: '.2',
            },
          },
        ],
        [
          {
            Kind: Kind.Seven,
            PlayedBy: PlayerOrNone.None,
            Suit: Suit.Spades,
            customStyles: {
              opacity: '.1',
            },
          },
        ],
      ],
      WonBy: PlayerOrNone.None,
    },
    {
      LaneAdvantage: PlayerOrNone.None,
      Rows: [
        [],
        [],
        [],
        [
          {
            Kind: Kind.Two,
            PlayedBy: PlayerOrNone.Host,
            Suit: Suit.Hearts,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [
          {
            Kind: Kind.Jack,
            PlayedBy: PlayerOrNone.Host,
            Suit: Suit.Hearts,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [],
        [
          {
            Kind: Kind.Ace,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Hearts,
            customStyles: {
              opacity: '.1',
            },
          },
        ],
      ],
      WonBy: PlayerOrNone.None,
    },
    {
      LaneAdvantage: PlayerOrNone.None,
      Rows: [
        [],
        [
          {
            Kind: Kind.Two,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Spades,
            customStyles: {
              opacity: '.2',
            },
          },
        ],
        [
          {
            Kind: Kind.Two,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Clubs,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [
          {
            Kind: Kind.Ten,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Clubs,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [],
        [],
        [],
      ],
      WonBy: PlayerOrNone.None,
    },
    {
      LaneAdvantage: PlayerOrNone.None,
      Rows: [
        [
          {
            Kind: Kind.Nine,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Clubs,
            customStyles: {
              opacity: '.1',
            },
          },
        ],
        [
          {
            Kind: Kind.Nine,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Hearts,
            customStyles: {
              opacity: '.2',
            },
          },
        ],
        [],
        [
          {
            Kind: Kind.Five,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Clubs,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [],
        [],
        [],
      ],
      WonBy: PlayerOrNone.None,
    },
    {
      LaneAdvantage: PlayerOrNone.None,
      Rows: [
        [],
        [],
        [],
        [
          {
            Kind: Kind.Six,
            PlayedBy: PlayerOrNone.Host,
            Suit: Suit.Spades,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [
          {
            Kind: Kind.Six,
            PlayedBy: PlayerOrNone.Host,
            Suit: Suit.Diamonds,
            customStyles: {
              opacity: '.3',
            },
          },
        ],
        [
          {
            Kind: Kind.King,
            PlayedBy: PlayerOrNone.Host,
            Suit: Suit.Diamonds,
            customStyles: {
              opacity: '.2',
            },
          },
        ],
        [
          {
            Kind: Kind.Jack,
            PlayedBy: PlayerOrNone.Guest,
            Suit: Suit.Diamonds,
            customStyles: {
              opacity: '.1',
            },
          },
        ],
      ],
      WonBy: PlayerOrNone.None,
    },
  ],
  MovesMade: [],
  NumCardsInOpponentsDeck: 0,
  NumCardsInOpponentsHand: 0,
  NumCardsInPlayersDeck: 0,
  BlackJokerLaneIndex: undefined,
  GameEndedTimestampUTC: '',
  RedJokerLaneIndex: undefined,
};
