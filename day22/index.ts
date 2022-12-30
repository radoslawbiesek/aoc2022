type Position = [x: number, y: number];
type Grid = { tile: '#' | '.'; position: Position }[];
type Direction = 'right' | 'left' | 'up' | 'down';
type Rotation = 'R' | 'L';
type Description = (number | Rotation)[];

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

function* stepsGenerator<T>(steps: T[]) {
  while (true) yield* steps;
}

function isNumber(str: string): boolean {
  return str === String(Number(str));
}

function parseInput(input: string[]): [Grid, Description] {
  const [descriptionStr, , ...rest] = input.reverse();

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

function turn(currDirection: Direction, letter: 'L' | 'R'): Direction {
  return directionsMap[currDirection][letter];
}

function isEqual(pos1: Position, pos2: Position): boolean {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

function walk(
  map: Grid,
  currPosition: Position,
  direction: Direction,
  stepsNumber: number
): Position {
  let newPosition: Position = currPosition;

  let stepsArr: Grid = [];
  const tiles: Grid =
    direction === 'right' || direction === 'left'
      ? map.filter(({ position: [, y] }) => y === newPosition[1]) // row
      : map.filter(({ position: [x] }) => x === currPosition[0]); // column

  const currentIndex = tiles.findIndex((v) =>
    isEqual(v.position, currPosition)
  );
  const before = tiles.slice(0, currentIndex);
  const after = tiles.slice(currentIndex + 1);

  if (direction === 'right' || direction === 'down') {
    stepsArr = [...after, ...before, tiles[currentIndex]];
  } else {
    stepsArr = [...before.reverse(), ...after.reverse(), tiles[currentIndex]];
  }

  const steps = stepsGenerator(stepsArr);

  for (let i = 0; i < stepsNumber; i++) {
    const next = steps.next().value!;
    if (next.tile === '#') break;
    newPosition = next.position;
  }

  return newPosition;
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

export function solution(input: string[]): number {
  const [map, description] = parseInput(input);

  let currPosition: Position = findStart(map);
  let currDirection: Direction = 'right';

  description.forEach((instruction) => {
    if (typeof instruction === 'string') {
      currDirection = turn(currDirection, instruction);
    } else if (typeof instruction === 'number') {
      currPosition = walk(map, currPosition, currDirection, instruction);
    }
  });

  return calculatePassword(currPosition, currDirection);
}
