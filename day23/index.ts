type Position = [x: number, y: number];

type DirectionFns = [
  findAll: (pos: Position) => Position[],
  findDirection: (pos: Position) => Position
];

function parseInput(list: string[]): Position[] {
  const positions: Position[] = [];
  list.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      if (char === '#') {
        positions.push([x, y]);
      }
    });
  });

  return positions;
}

const findN = ([x, y]: Position): Position => [x, y - 1];
const findNE = ([x, y]: Position): Position => [x + 1, y - 1];
const findNW = ([x, y]: Position): Position => [x - 1, y - 1];
const findW = ([x, y]: Position): Position => [x - 1, y];
const findE = ([x, y]: Position): Position => [x + 1, y];
const findS = ([x, y]: Position): Position => [x, y + 1];
const findSE = ([x, y]: Position): Position => [x + 1, y + 1];
const findSW = ([x, y]: Position): Position => [x - 1, y + 1];

const findAllN = (pos: Position): Position[] => [
  findN(pos),
  findNE(pos),
  findNW(pos),
];

const findAllS = (pos: Position): Position[] => [
  findS(pos),
  findSE(pos),
  findSW(pos),
];

const findAllE = (pos: Position): Position[] => [
  findE(pos),
  findNE(pos),
  findSE(pos),
];

const findAllW = (pos: Position): Position[] => [
  findW(pos),
  findNW(pos),
  findSW(pos),
];

function findAdjacents(pos: Position): Position[] {
  return [
    findN(pos),
    findNE(pos),
    findNW(pos),
    findW(pos),
    findE(pos),
    findS(pos),
    findSE(pos),
    findSW(pos),
  ];
}

function comparePositions(pos1: Position, pos2: Position): boolean {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

function haveCommonPosition(arr1: Position[], arr2: Position[]): boolean {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      const pos1 = arr1[i];
      const pos2 = arr2[j];

      if (comparePositions(pos1, pos2)) {
        return true;
      }
    }
  }
  return false;
}

function countPositions(arr: Array<Position | null>, pos: Position): number {
  let count = 0;
  arr.forEach((posToCompare) => {
    if (posToCompare && comparePositions(posToCompare, pos)) {
      count++;
    }
  });
  return count;
}

function round(positions: Position[], functions: DirectionFns[]): Position[] {
  // first half
  const propositions: Array<Position | null> = [];
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    if (!haveCommonPosition(positions, findAdjacents(position))) {
      propositions.push(null);
    } else {
      let proposition = null;
      for (let y = 0; y < functions.length; y++) {
        const [findAll, findDirection] = functions[y];

        if (!haveCommonPosition(findAll(position), positions)) {
          proposition = findDirection(position);
          break;
        }
      }
      propositions.push(proposition);
    }
  }

  // second half
  const finalPositions: Position[] = [];
  for (let i = 0; i < positions.length; i++) {
    const currentPosition = positions[i];
    const proposition = propositions[i];
    if (!proposition || countPositions(propositions, proposition) > 1) {
      finalPositions.push(currentPosition);
    } else {
      finalPositions.push(proposition);
    }
  }

  return finalPositions;
}

export function countEmptyTiles(list: string[]): number {
  let positions = parseInput(list);

  const directionFns: DirectionFns[] = [
    [findAllN, findN],
    [findAllS, findS],
    [findAllW, findW],
    [findAllE, findE],
  ];

  for (let i = 0; i < 10; i++) {
    positions = round(positions, directionFns);
    directionFns.push(directionFns.shift() as DirectionFns);
  }

  const xMax = Math.max(...positions.map(([x]) => x));
  const xMin = Math.min(...positions.map(([x]) => x));
  const yMax = Math.max(...positions.map(([, y]) => y));
  const yMin = Math.min(...positions.map(([, y]) => y));

  const height = yMax - yMin + 1;
  const width = xMax - xMin + 1;

  return height * width - positions.length;
}

export function countRounds(list: string[]): number {
  let positions = parseInput(list);

  const directionFns: DirectionFns[] = [
    [findAllN, findN],
    [findAllS, findS],
    [findAllW, findW],
    [findAllE, findE],
  ];

  let count = 1;
  while (true) {
    const newPositions = round(positions, directionFns);

    let moved = false;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const newPosition = newPositions[i];
      if (!comparePositions(position, newPosition)) {
        moved = true;
      }
    }
    if (!moved) return count;
    count++;
    positions = newPositions;
    directionFns.push(directionFns.shift() as DirectionFns);
  }
}
