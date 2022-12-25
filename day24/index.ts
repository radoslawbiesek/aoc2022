type Direction = '>' | '<' | '^' | 'v';
type Position = [x: number, y: number];
type Blizzard = [Direction, Position];

type Grid = (Direction | '.' | '#' | number)[][];

const dirsMap: Record<Direction, Position> = {
  '>': [1, 0],
  '<': [-1, 0],
  '^': [0, 1],
  v: [0, -1],
};

class Valley {
  #blizzards: Blizzard[] = [];
  #walls: Position[] = [];
  #cache: Grid[] = [];
  #height: number = 0;
  #width: number = 0;

  constructor(list: string[]) {
    this.#height = list.length;
    for (let y = 0; y < list.length; y++) {
      const line = list[y].split('');
      this.#width = line.length;
      for (let x = 0; x < line.length; x++) {
        const char = line[x];

        if (char === '#') {
          this.#walls.push([x, y]);
        } else if (Object.keys(dirsMap).includes(char)) {
          this.#blizzards.push([char as Direction, [x, y]]);
        }
      }
    }
  }

  #calculateIndex(
    current: number,
    toMove: number,
    min: number,
    max: number
  ): number {
    let newIndex = current;
    for (let i = 0; i < Math.abs(toMove); i++) {
      if (toMove > 0) {
        newIndex++;
        if (newIndex > max) {
          newIndex = min;
        }
      } else {
        newIndex--;
        if (newIndex < min) {
          newIndex = max;
        }
      }
    }

    return newIndex;
  }

  #calculateBlizzards(currentTime: number): Blizzard[] {
    const innerHeight = this.#height - 2;
    const innerWidth = this.#width - 2;

    const toMoveY = currentTime % innerHeight;
    const toMoveX = currentTime % innerWidth;

    const minX = 1;
    const minY = 1;
    const maxX = this.#width - 2;
    const maxY = this.#height - 2;

    return this.#blizzards.map((blizzard) => {
      const [direction, [x, y]] = blizzard;

      let newY = y;
      let newX = x;

      if (direction === '^') {
        newY = this.#calculateIndex(y, -toMoveY, minY, maxY);
      } else if (direction === 'v') {
        newY = this.#calculateIndex(y, toMoveY, minY, maxY);
      } else if (direction === '>') {
        newX = this.#calculateIndex(x, toMoveX, minX, maxX);
      } else if (direction === '<') {
        newX = this.#calculateIndex(x, -toMoveX, minX, maxX);
      }

      return [direction, [newX, newY]];
    });
  }

  toGrid(currentTime: number): Grid {
    if (this.#cache[currentTime]) {
      return this.#cache[currentTime];
    }

    const grid: Grid = Array(this.#height)
      .fill(null)
      .map(() => Array(this.#width).fill('.'));

    this.#walls.forEach((wall) => {
      const [x, y] = wall;
      grid[y][x] = '#';
    });

    this.#calculateBlizzards(currentTime).forEach((blizzard) => {
      const [dir, [x, y]] = blizzard;

      const current = grid[y][x];

      if (Object.keys(dirsMap).includes(current as Direction)) {
        grid[y][x] = 2;
      } else if (Number(current) === current) {
        grid[y][x] = current + 1;
      } else {
        grid[y][x] = dir;
      }
    });

    this.#cache[currentTime] = grid;

    return grid;
  }
}

function isBlizzard(position: Position, grid: Grid) {
  const [x, y] = position;
  const char = grid[y][x];
  return (
    typeof char === 'number' ||
    char === '<' ||
    char === '>' ||
    char === '^' ||
    char === 'v'
  );
}

function getPossibleSquares(grid: Grid, currentPosition: Position): Position[] {
  const MAX_X = grid[0].length - 1;
  const MAX_Y = grid.length - 1;
  const [x, y] = currentPosition;

  const positions: Position[] = [];

  // wait
  if (!isBlizzard(currentPosition, grid)) {
    positions.push([x, y]);
  }

  // up
  if (y - 1 >= 0 && grid[y - 1][x] !== '#' && !isBlizzard([x, y - 1], grid)) {
    positions.push([x, y - 1]);
  }

  // down
  if (
    y + 1 <= MAX_Y &&
    grid[y + 1][x] !== '#' &&
    !isBlizzard([x, y + 1], grid)
  ) {
    positions.push([x, y + 1]);
  }

  // left
  if (x - 1 >= 0 && grid[y][x - 1] !== '#' && !isBlizzard([x - 1, y], grid)) {
    positions.push([x - 1, y]);
  }

  // right
  if (
    x + 1 <= MAX_X &&
    grid[y][x + 1] !== '#' &&
    !isBlizzard([x + 1, y], grid)
  ) {
    positions.push([x + 1, y]);
  }

  return positions;
}

class State {
  constructor(public position: Position, public currentTime: number) {}

  stringify() {
    const [x, y] = this.position;
    return `${x}-${y}-${this.currentTime}`;
  }
}

function findShortestPath(
  list: string[],
  start: Position,
  end: Position,
  currentTime: number
): number {
  const valley = new Valley(list);
  let minTime = Infinity;
  const startState = new State(start, currentTime);
  const queue: State[] = [startState];
  const seen = new Set([startState.stringify()]);

  while (queue.length) {
    const { currentTime, position } = queue.shift() as State;

    if (currentTime > minTime) {
      continue;
    }

    if (position[0] === end[0] && position[1] === end[1]) {
      minTime = currentTime;
      continue;
    }

    const grid = valley.toGrid(currentTime + 1);
    for (const square of getPossibleSquares(grid, position)) {
      const nextState = new State(square, currentTime + 1);
      if (!seen.has(nextState.stringify())) {
        queue.push(nextState);
        seen.add(nextState.stringify());
      }
    }
  }

  return minTime;
}

export function solution1(list: string[]): number {
  const start: Position = [1, 0];
  const end: Position = [list[0].length - 2, list.length - 1];

  return findShortestPath(list, start, end, 0);
}

export function solution2(list: string[]) {
  const start: Position = [1, 0];
  const end: Position = [list[0].length - 2, list.length - 1];

  const time1 = findShortestPath(list, start, end, 0);
  const time2 = findShortestPath(list, end, start, time1);
  const time3 = findShortestPath(list, start, end, time2);

  return time3;
}
