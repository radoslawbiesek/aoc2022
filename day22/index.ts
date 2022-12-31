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

function row(y: number) {
  return function (el: Grid[number]): boolean {
    return el.position[1] === y;
  };
}

function column(x: number) {
  return function (el: Grid[number]): boolean {
    return el.position[0] === x;
  };
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
      ? map.filter(row(y))
      : map.filter(column(x));

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
    return (faceCount + 1) * faceSize - 1 - position;
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

function withDirection(
  currDirection: Direction,
  letter: 'L' | 'R' = 'L',
  times = 0
) {
  return function <T>(value: T) {
    return {
      ...value,
      direction: turn(currDirection, letter, times),
    };
  };
}

// Test input

const FACE_SIZE_T = 4;

const detectFaceT = _detectFace(FACE_SIZE_T, {
  1: [2, 0],
  2: [0, 1],
  3: [1, 1],
  4: [2, 1],
  5: [2, 2],
  6: [3, 2],
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
    tiles = [...map.filter(column(x)).map(withDirection(currDirection))];
    switch (currentFace) {
      case 1:
      case 4:
      case 5:
        tiles = [
          ...tiles, // col 1,4,5
          ...map
            .filter(column(fromEndT(0, diffStartT(2, x))))
            .reverse()
            .map(withDirection(currDirection, 'L', 2)), // col 2
        ];

        break;
      case 3:
        tiles = [
          ...tiles, // col 3
          ...map
            .filter(row(fromStartT(2, diffEndT(2, x))))
            .map(withDirection(currDirection, 'L', 1)), // row 5,6
          ...map
            .filter(row(fromEndT(0, diffEndT(2, x))))
            .reverse()
            .map(withDirection(currDirection, 'L', 3)), // row 1
        ];

        break;
    }
  } else {
    tiles = [...map.filter(row(y)).map(withDirection(currDirection))];
    switch (currentFace) {
      case 2:
      case 3:
      case 4:
        tiles = [
          ...tiles, // row 2, 3, 4
          ...map
            .filter(column(fromEndT(3, diffStartT(1, y))))
            .map(withDirection(currDirection, 'R', 1)), // col 6
        ];

        break;
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

// Input

const FACE_SIZE = 50;

const detectFace = _detectFace(FACE_SIZE, {
  1: [1, 0],
  2: [2, 0],
  3: [1, 1],
  4: [0, 2],
  5: [1, 2],
  6: [0, 3],
});

const fromStart = _fromStart(FACE_SIZE);
const fromEnd = _fromEnd(FACE_SIZE);
const diffStart = _diffStart(FACE_SIZE);
const diffEnd = _diffEnd(FACE_SIZE);

function prepareStepsCube(
  map: Grid,
  currPosition: Position,
  currDirection: Direction
): Generator<GridEl & { direction?: Direction }> {
  const currentFace = detectFace(currPosition);

  let tiles: (GridEl & { direction?: Direction })[] = [];
  const [x, y] = currPosition;

  if (currDirection === 'down' || currDirection === 'up') {
    tiles = [...map.filter(column(x)).map(withDirection(currDirection))];
    switch (currentFace) {
      case 1:
      case 3:
      case 5:
        tiles = [
          ...tiles, // col 1,3,5
          ...map
            .filter(row(fromStart(3, diffStart(1, x))))
            .reverse()
            .map(withDirection(currDirection, 'R', 1)), // row 6
        ];
        break;

      case 4:
      case 6:
        tiles = [
          ...tiles, // col 4,6
          ...map
            .filter(column(fromStart(2, diffStart(0, x))))
            .map(withDirection(currDirection)), // col 2,
          ...map
            .filter(row(fromStart(1, diffStart(0, x))))
            .map(withDirection(currDirection, 'R', 1)), // row 3
        ];
        break;

      case 2:
        tiles = [
          ...tiles, // col 2
          ...map
            .filter(row(fromStart(1, diffStart(2, x))))
            .map(withDirection(currDirection, 'R', 1)), // row 3
          ...map
            .filter(column(fromStart(0, diffStart(2, x))))
            .map(withDirection(currDirection)), // column 4,6
        ];
        break;
    }
  } else {
    tiles = [...map.filter(row(y)).map(withDirection(currDirection))];
    switch (currentFace) {
      case 1:
      case 2: {
        tiles = [
          ...tiles, // row 1,2
          ...map
            .filter(row(fromEnd(2, diffStart(0, y))))
            .reverse()
            .map(withDirection(currDirection, 'R', 2)), // row 5,4
        ];
        break;
      }

      case 3: {
        tiles = [
          ...tiles, // row 3,
          ...map
            .filter(column(fromEnd(2, diffEnd(1, y))))
            .reverse()
            .map(withDirection(currDirection, 'L', 1)), // col 2
          ...map
            .filter(column(fromEnd(0, diffEnd(1, y))))
            .reverse()
            .map(withDirection(currDirection, 'L', 1)), // col 6,4
        ];
        break;
      }

      case 4:
      case 5: {
        tiles = [
          ...tiles, // row 4,5
          ...map
            .filter(row(fromEnd(0, diffStart(2, y))))
            .reverse()
            .map(withDirection(currDirection, 'L', 2)), // row 2,1
        ];
        break;
      }

      case 6: {
        tiles = [
          ...tiles, // row 6
          ...map
            .filter(column(fromStart(1, diffStart(3, y))))
            .reverse()
            .map(withDirection(currDirection, 'L', 1)), // column 5,3,1
        ];
        break;
      }
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
export const solution2 = _solution(prepareStepsCube);
