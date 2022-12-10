type Direction = 'R' | 'L' | 'D' | 'U';
type Position = [x: number, y: number];

const DirectionMap: Record<Direction, Position> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

function parseMoves(list: string[]): Direction[] {
  return list.reduce((acc, row) => {
    const [direction, steps] = row.split(' ');

    return [...acc, ...Array(Number(steps)).fill(direction)];
  }, [] as Direction[]);
}

export function countVisited(list: string[], knots: number): number {
  const moves = parseMoves(list);

  const positions: Position[] = Array(knots)
    .fill(null)
    .map(() => [0, 0]);

  const visited = new Set();

  for (let direction of moves) {
    // move head
    positions[0] = move(positions[0], direction);

    // update other knots
    for (let i = 0; i < knots - 1; i++) {
      positions[i + 1] = updateTail(positions[i + 1], positions[i]);

      if (i + 1 === positions.length - 1) {
        visited.add(`[${positions[i + 1][0]},${positions[i + 1][1]}]`);
      }
    }
  }

  return visited.size;
}

function move(currentPosition: Position, direction: Direction): Position {
  const [currentX, currentY] = currentPosition;
  const [toMoveX, toMoveY] = DirectionMap[direction];

  return [currentX + toMoveX, currentY + toMoveY];
}

function updateTail(tailPosition: Position, headPosition: Position): Position {
  const [currentHeadX, currentHeadY] = headPosition;
  const [currentTailX, currentTailY] = tailPosition;

  const diffX = currentHeadX - currentTailX;
  const diffY = currentHeadY - currentTailY;

  let updated: Position = [currentTailX, currentTailY];

  if (Math.abs(diffX) >= 2) {
    updated = move(updated, diffX > 1 ? 'R' : 'L');

    if (Math.abs(diffY) >= 1) {
      // different row, move diagonally
      updated = move(updated, diffY >= 1 ? 'U' : 'D');
    }
  } else if (Math.abs(diffY) >= 2) {
    updated = move(updated, diffY > 1 ? 'U' : 'D');

    if (Math.abs(diffX) >= 1) {
      // differen column, move diagonally
      updated = move(updated, diffX >= 1 ? 'R' : 'L');
    }
  }

  return updated;
}

function drawGrid(positions: Position[], size = 25): void {
  const ZERO_INDEX = Math.floor(size / 2);
  const EMPTY = '.';

  const grid = Array(size).fill(EMPTY);

  positions.forEach((position, index) => {
    const [x, y] = position;
    const absX = x + ZERO_INDEX;
    const absY = y + ZERO_INDEX;
    if (grid[absY][absX] === EMPTY) {
      const char = index === 0 ? 'H' : index.toString();
      grid[absY][absX] = char;
    }
  });

  const stringified = grid
    .reverse()
    .map((row) => row.join(''))
    .join('\n');

  console.log(stringified);
}
