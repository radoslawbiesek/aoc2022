function compare(left: unknown[], right: unknown[]): -1 | 0 | 1 {
  for (let i = 0; i < left.length && i < right.length; i++) {
    const leftEl = left[i];
    const rightEl = right[i];

    if (typeof leftEl === 'number' && typeof rightEl === 'number') {
      if (leftEl < rightEl) return -1;
      if (leftEl > rightEl) return 1;
    } else {
      let result = 0;
      if (Array.isArray(leftEl) && Array.isArray(rightEl)) {
        result = compare(leftEl, rightEl);
      } else if (typeof leftEl === 'number' && Array.isArray(rightEl)) {
        result = compare([leftEl], rightEl);
      } else if (Array.isArray(leftEl) && typeof rightEl === 'number') {
        result = compare(leftEl, [rightEl]);
      }
      if (result === 1 || result === -1) return result;
    }
  }

  if (right.length > left.length) return -1;
  if (left.length > right.length) return 1;

  return 0;
}

function parseInput(list: string[]): unknown[][] {
  return list.filter(Boolean).map((str) => JSON.parse(str));
}

export function countOrderedPackets(list: string[]): number {
  const parsed = parseInput(list);
  let total = 0;

  for (let i = 0; i < parsed.length - 1; i = i + 2) {
    const pairIndex = i / 2 + 1;
    const left = parsed[i];
    const right = parsed[i + 1];

    const isOrdered = compare(left, right) === -1;

    if (isOrdered) {
      total += pairIndex;
    }
  }

  return total;
}

export function findDecoderKey(list: string[]): number {
  const parsed = parseInput(list);
  const dividerPackages = [[[2]], [[6]]];

  const sorted = parsed.concat(dividerPackages).sort(compare);

  const index1 = sorted.findIndex((el) => el === dividerPackages[0]) + 1;
  const index2 = sorted.findIndex((el) => el === dividerPackages[1]) + 1;

  return index1 * index2;
}
