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
  const { LastCardPlayed } = lane;

  const isLastCardPlayed =
    topCard &&
    LastCardPlayed &&
    LastCardPlayed.PlayedBy !== PlayerOrNone.None &&
    topCard.Kind === LastCardPlayed.Kind &&
    topCard.Suit === LastCardPlayed.Suit;

  const positionColor = isLastCardPlayed
    ? getLastCardPlayedBackgroundClass(topCard!, isHost, isPlayersTurn)
    : getDefaultBackgroundClasses(laneIndex, rowIndex).backgroundClass;

  const inverseBackgroundClasses = getDefaultBackgroundClasses(
    laneIndex,
    rowIndex + 1
  );

  const { laneColor } = getLaneBackgroundClass(lane, isHost, isPlayersTurn);
  const positionClass =
    lane.WonBy === PlayerOrNone.None ? positionColor : laneColor;
  const textClass =
    lane.WonBy === PlayerOrNone.None
      ? inverseBackgroundClasses.textClass
      : 'lanes-bg-lightgreen';

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
    textClass: evenSum ? 'lanes-text-green' : 'lanes-text-lightgreen',
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
