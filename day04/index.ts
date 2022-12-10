export type PairStr = `${number}-${number},${number}-${number}`;
type Range = [number, number];
type Pair = [Range, Range];

function dividePair(pairStr: PairStr): Pair {
  return pairStr
    .split(',')
    .map((range) => range.split('-').map((s) => parseInt(s))) as Pair;
}

function overlappingFully(pair: Pair): boolean {
  const [range1, range2] = pair;
  let greaterRange: Range, otherRange: Range;

  if (range1[1] - range1[0] >= range2[1] - range2[0]) {
    greaterRange = range1;
    otherRange = range2;
  } else {
    greaterRange = range2;
    otherRange = range1;
  }

  return greaterRange[0] <= otherRange[0] && greaterRange[1] >= otherRange[1];
}

function overlappingPartially(pair: Pair): boolean {
  const [range1, range2] = pair;

  return (
    (range1[0] >= range2[0] && range1[0] <= range2[1]) ||
    (range2[0] >= range1[0] && range2[0] <= range1[1])
  );
}

function countPairs(filterFn: (pair: Pair) => boolean) {
  return function (list: PairStr[]): number {
    return list.map(dividePair).filter(filterFn).length;
  };
}

export const countFullyOverlappingPairs = countPairs(overlappingFully);
export const countPartiallyOverlappingPairs = countPairs(overlappingPartially);
