type Position = [x: number, y: number];
type GridEl = { tile: '#' | '.'; position: Position };
type Grid = GridEl[];
type Direction = 'right' | 'left' | 'up' | 'down';
type Rotation =
  | 'R' // clockwise
  | 'L'; // counterclockwise
type Description = (number | Rotation)[];
type FaceIndex = 1 | 2 | 3 | 4 | 5 | 6;

function* stepsGenerator<T>(steps: T[]) {
  while (true) yield* steps;
}

function isNumber(str: string): boolean {
  return str === String(Number(str));
}

function parseInput(input: string[]): [Grid, Description] {
  const [descriptionStr, , ...rest] = [...input].reverse();

  const map = rest
    .reverse()
    .map((r, y) =>
      r.split('').reduce((acc: Grid, char, x) => {
        if (char === '.' || char === '#') {
          acc.push({ tile: char, position: [x, y] });
        }
        return acc;
      }, [])
    )
    .flat();

  const description = descriptionStr
    .split('')
    .reduce((acc: string[], char: string) => {
      const last = acc[acc.length - 1];
      if (isNumber(last) && isNumber(char)) {
        acc[acc.length - 1] = acc[acc.length - 1] + char;
      } else {
        acc.push(char);
      }
      return acc;
    }, [])
    .map((item) => (isNumber(item) ? Number(item) : item)) as Description;

  return [map, description];
}

function findStart(map: Grid): Position {
  const found = map.find(
    ({ tile, position: [, y] }) => y === 0 && tile === '.'
  );
  return found!.position;
}

function turn(
  currDirection: Direction,
  letter: 'L' | 'R',
  times = 1
): Direction {
  const directionsMap: Record<Direction, Record<Rotation, Direction>> = {
    up: {
      L: 'left',
      R: 'right',
    },
    right: {
      L: 'up',
      R: 'down',
    },
    down: {
      L: 'right',
      R: 'left',
    },
    left: {
      L: 'down',
      R: 'up',
    },
  };

  let newDirection = currDirection;
  for (let i = 0; i < times; i++) {
    newDirection = directionsMap[newDirection][letter];
  }
  return newDirection;
}

function isEqual(pos1: Position, pos2: Position): boolean {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

function reorder<T>(arr: T[], index: number, reverse = false): T[] {
  const before = arr.slice(0, index);
  const after = arr.slice(index + 1);

  if (reverse) {
    return [...before.reverse(), ...after.reverse(), arr[index]];
  } else {
    return [...after, ...before, arr[index]];
  }
}

function filterRow(map: Grid, y: number): Grid {
  return map.filter(({ position }) => position[1] === y);
}

function filterColumn(map: Grid, x: number): Grid {
  return map.filter(({ position }) => position[0] === x);
}

function prepareSteps(
  map: Grid,
  currPosition: Position,
  direction: Direction
): Generator<Grid[number]> {
  const [x, y] = currPosition;
  let stepsArr: Grid = [];
  const tiles: Grid =
    direction === 'right' || direction === 'left'
      ? filterRow(map, y)
      : filterColumn(map, x);

  const currentIndex = tiles.findIndex((v) =>
    isEqual(v.position, currPosition)
  );

  stepsArr = reorder(
    tiles,
    currentIndex,
    direction === 'left' || direction === 'up'
  );

  const steps = stepsGenerator(stepsArr);

  return steps;
}

function _fromStart(faceSize: number) {
  return function (faceCount: number, dist: number) {
    return faceSize * faceCount + dist;
  };
}

function _fromEnd(faceSize: number) {
  return function (faceCount: number, dist: number) {
    return (faceCount + 1) * faceSize - 1 - dist;
  };
}

function _diffStart(faceSize: number) {
  return function (faceCount: number, position: number) {
    return position - faceCount * faceSize;
  };
}

function _diffEnd(faceSize: number) {
  return function (faceCount: number, position: number) {
    return faceCount * faceSize - 1 - position;
  };
}

function _detectFace(
  faceSize: number,
  positionMap: Record<FaceIndex, [xRow: number, yRow: number]>
) {
  return function (position: Position): FaceIndex {
    const [x, y] = position;

    for (let i = 0; i < Object.keys(positionMap).length; i++) {
      const face = (i + 1) as FaceIndex;
      const [xRow, yRow] = positionMap[face];

      if (
        x >= xRow * faceSize &&
        x < (xRow + 1) * faceSize &&
        y >= yRow * faceSize &&
        y < (yRow + 1) * faceSize
      ) {
        return face;
      }
    }

    throw Error('Not found: ' + position);
  };
}

// Test input

const FACE_SIZE_T = 4;

const detectFaceT = _detectFace(FACE_SIZE_T, {
  1: [2, 0], // 1
  2: [0, 1], // 2
  3: [1, 1], // 3
  4: [2, 1], // 4
  5: [2, 2], // 5
  6: [3, 2], // 6
});

const fromStartT = _fromStart(FACE_SIZE_T);
const fromEndT = _fromEnd(FACE_SIZE_T);
const diffStartT = _diffStart(FACE_SIZE_T);
const diffEndT = _diffEnd(FACE_SIZE_T);

function prepareStepsCubeT(
  map: Grid,
  currPosition: Position,
  currDirection: Direction
): Generator<GridEl & { direction?: Direction }> {
  const currentFace = detectFaceT(currPosition);

  let tiles: (GridEl & { direction?: Direction })[] = [];
  const [x, y] = currPosition;

  // only used cases are handled
  if (currDirection === 'down' || currDirection === 'up') {
    tiles = [
      ...filterColumn(map, x).map((v) => ({ ...v, direction: currDirection })),
    ];
    switch (currentFace) {
      case 1:
      case 4:
      case 5:
        tiles = [
          ...tiles, // col 1,4,5
          ...filterColumn(map, fromEndT(0, diffStartT(2, x)))
            .reverse()
            .map((v) => ({
              ...v,
              direction: turn(currDirection, 'L', 2),
            })), // col 2
        ];
      case 3:
        tiles = [
          ...tiles, // col 3
          ...filterRow(map, fromStartT(2, diffEndT(2, x))).map((v) => ({
            ...v,
            direction: turn(currDirection, 'L', 1),
          })), // row 5,6
          ...filterRow(map, fromEndT(0, diffEndT(2, x)))
            .reverse()
            .map((v) => ({
              ...v,
              direction: turn(currDirection, 'L', 3),
            })), // row 1
        ];
    }
  } else {
    tiles = [
      ...filterRow(map, y).map((v) => ({ ...v, direction: currDirection })),
    ];
    switch (currentFace) {
      case 2:
      case 3:
      case 4:
        tiles = [
          ...tiles, // row 2, 3, 4
          ...filterColumn(map, fromEndT(3, diffStartT(1, y))).map((v) => ({
            ...v,
            direction: turn(currDirection, 'R', 1),
          })), // col 6
        ];
    }
  }

  const currentIndex = tiles.findIndex((v) =>
    isEqual(v.position, currPosition)
  );

  const stepsArr = reorder(
    tiles,
    currentIndex,
    currDirection === 'left' || currDirection === 'up'
  );
  const steps = stepsGenerator(stepsArr);

  return steps;
}

// Solution

function walk(
  currPosition: Position,
  currDirection: Direction,
  steps: Generator<Grid[number]>,
  stepsNumber: number
): [Position, Direction | undefined] {
  let newPosition: Position = currPosition;
  let newDirection: Direction = currDirection;

  for (let i = 0; i < stepsNumber; i++) {
    const next = steps.next().value!;
    if (next.tile === '#') break;
    newPosition = next.position;
    newDirection = next.direction;
  }

  return [newPosition, newDirection];
}

function calculatePassword([x, y]: Position, direction: Direction): number {
  const directionsValueMap: Record<Direction, number> = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  return 1000 * (y + 1) + 4 * (x + 1) + directionsValueMap[direction];
}

function _solution(
  prepareStepsFn: (
    map: Grid,
    currPosition: Position,
    direction: Direction
  ) => Generator<Grid[number]>
) {
  return function (input: string[]): number {
    const [map, description] = parseInput(input);

    let currPosition: Position = findStart(map);
    let currDirection: Direction = 'right';

    description.forEach((instruction) => {
      if (typeof instruction === 'string') {
        currDirection = turn(currDirection, instruction);
      } else if (typeof instruction === 'number') {
        const steps = prepareStepsFn(map, currPosition, currDirection);
        const [newPosition, newDirection] = walk(
          currPosition,
          currDirection,
          steps,
          instruction
        );
        currPosition = newPosition;
        if (newDirection) {
          currDirection = newDirection;
        }
      }
    });

    return calculatePassword(currPosition, currDirection);
  };
}

export const solution = _solution(prepareSteps);
export const solution2t = _solution(prepareStepsCubeT);
