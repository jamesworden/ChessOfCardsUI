import { Lane, PlayerOrNone, Card } from '@shared/models';
import { playerHasWonLane } from './player-has-won-lane';

export function getPositionBackgroundClass(
  lane: Lane,
  laneIndex: number,
  rowIndex: number,
  isHost: boolean,
  isPlayersTurn: boolean,
  isSelected: boolean,
  topCard?: Card
) {
  const isLastCardPlayed =
    topCard &&
    lane.lastCardPlayed &&
    lane.lastCardPlayed.playedBy !== PlayerOrNone.None &&
    topCard.kind === lane.lastCardPlayed.kind &&
    topCard.suit === lane.lastCardPlayed.suit;

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

  if (lane.wonBy !== PlayerOrNone.None) {
    textClass = 'lanes-text-lightgreen';
  }

  const { laneColor } = getLaneBackgroundClass(lane, isHost, isPlayersTurn);
  let positionClass =
    lane.wonBy === PlayerOrNone.None ? backgroundClass : laneColor;

  if (isSelected) {
    positionClass = 'bg-yellow-400';
    textClass = 'lanes-text-green';
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
    lastCardPlayed.playedBy === PlayerOrNone.Host && isHost;
  const guestAndPlayedByGuest =
    lastCardPlayed.playedBy === PlayerOrNone.Guest && !isHost;
  const playerPlayedCard = hostAndPlayedByHost || guestAndPlayedByGuest;

  return playerPlayedCard
    ? getPlayerBackgroundClass(isPlayersTurn)
    : getOpponentBackgroundClass(isPlayersTurn);
}
