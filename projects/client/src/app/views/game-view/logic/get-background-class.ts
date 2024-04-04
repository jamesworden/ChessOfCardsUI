import { Card } from '../../../models/card.model';
import { Lane } from '../../../models/lane.model';
import { PlayerOrNone } from '../../../models/player-or-none.model';
import { playerHasWonLane } from './player-has-won-lane';

export function getPositionBackgroundClass(
  lane: Lane,
  laneIndex: number,
  rowIndex: number,
  isHost: boolean,
  isPlayersTurn: boolean,
  topCard?: Card
) {
  const isLastCardPlayed =
    topCard &&
    lane.LastCardPlayed &&
    lane.LastCardPlayed.PlayedBy !== PlayerOrNone.None &&
    topCard.Kind === lane.LastCardPlayed.Kind &&
    topCard.Suit === lane.LastCardPlayed.Suit;

  let { backgroundClass, textClass } = getDefaultBackgroundClasses(
    laneIndex,
    rowIndex
  );
  if (isLastCardPlayed) {
    backgroundClass = getLastCardPlayedBackgroundClass(
      topCard!,
      isHost,
      isPlayersTurn
    );
  }
  const { laneColor } = getLaneBackgroundClass(lane, isHost, isPlayersTurn);
  const positionClass =
    lane.WonBy === PlayerOrNone.None ? backgroundClass : laneColor;

  if (lane.WonBy !== PlayerOrNone.None) {
    textClass = 'lanes-text-lightgreen';
  }

  return {
    positionClass,
    textClass,
  };
}

export function getDefaultBackgroundClasses(
  laneIndex: number,
  rowIndex: number
) {
  const rowAndLaneIndexSum = laneIndex + rowIndex;
  const evenSum = rowAndLaneIndexSum % 2 === 0;

  return {
    backgroundClass: evenSum ? 'lanes-bg-green' : 'lanes-bg-lightgreen',
    textClass: evenSum ? 'lanes-text-lightgreen' : 'lanes-text-green',
  };
}

function getLaneBackgroundClass(
  lane: Lane,
  isHost: boolean,
  isPlayersTurn: boolean
) {
  const laneColor = playerHasWonLane(isHost, lane)
    ? getPlayerBackgroundClass(isPlayersTurn)
    : getOpponentBackgroundClass(isPlayersTurn);

  const reverseLaneColor = playerHasWonLane(isHost, lane)
    ? getOpponentBackgroundClass(isPlayersTurn)
    : getPlayerBackgroundClass(isPlayersTurn);

  return {
    laneColor,
    reverseLaneColor,
  };
}

function getPlayerBackgroundClass(isPlayersTurn: boolean) {
  return isPlayersTurn ? 'bg-sky-700' : 'bg-sky-900';
}

function getOpponentBackgroundClass(isPlayersTurn: boolean) {
  return isPlayersTurn ? 'bg-rose-900' : 'bg-rose-700';
}

function getLastCardPlayedBackgroundClass(
  lastCardPlayed: Card,
  isHost: boolean,
  isPlayersTurn: boolean
) {
  const hostAndPlayedByHost =
    lastCardPlayed.PlayedBy === PlayerOrNone.Host && isHost;
  const guestAndPlayedByGuest =
    lastCardPlayed.PlayedBy === PlayerOrNone.Guest && !isHost;
  const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

  return playerPlayedCard
    ? getPlayerBackgroundClass(isPlayersTurn)
    : getOpponentBackgroundClass(isPlayersTurn);
}
