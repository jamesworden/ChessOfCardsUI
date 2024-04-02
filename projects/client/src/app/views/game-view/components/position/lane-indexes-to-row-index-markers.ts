interface LaneIndexToRowIndexMarkers {
  [laneIndex: number]:
    | {
        [rowIndex: number]:
          | {
              topLeft?: string;
              bottomRight?: string;
            }
          | undefined;
      }
    | undefined;
}

export const hostLaneIndexesToRowIndexMarkers: LaneIndexToRowIndexMarkers = {
  0: {
    0: {
      topLeft: '1',
      bottomRight: 'a',
    },
    1: {
      topLeft: '2',
    },
    2: {
      topLeft: '3',
    },
    3: {
      topLeft: '4',
    },
    4: {
      topLeft: '5',
    },
    5: {
      topLeft: '6',
    },
    6: {
      topLeft: '7',
    },
  },
  1: {
    0: {
      bottomRight: 'b',
    },
  },
  2: {
    0: {
      bottomRight: 'c',
    },
  },
  3: {
    0: {
      bottomRight: 'd',
    },
  },
  4: {
    0: {
      bottomRight: 'e',
    },
  },
};

export const guestLaneIndexesToRowIndexMarkers: LaneIndexToRowIndexMarkers = {
  4: {
    6: {
      topLeft: '7',
      bottomRight: 'e',
    },
    5: {
      topLeft: '6',
    },
    4: {
      topLeft: '5',
    },
    3: {
      topLeft: '4',
    },
    2: {
      topLeft: '3',
    },
    1: {
      topLeft: '2',
    },
    0: {
      topLeft: '1',
    },
  },
  3: {
    6: {
      bottomRight: 'd',
    },
  },
  2: {
    6: {
      bottomRight: 'c',
    },
  },
  1: {
    6: {
      bottomRight: 'b',
    },
  },
  0: {
    6: {
      bottomRight: 'a',
    },
  },
};
