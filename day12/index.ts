import { LETTERS } from '../utils';

type Coord = {
  height: number;
  y: number;
  x: number;
  visitedBy: '' | 'S' | 'E';
  length: number;
};
type Maze = Coord[][];
type Position = [y: number, x: number];

const heightMap: Record<string, number> = LETTERS.reduce(
  (acc, letter, index) => ({ ...acc, [letter]: index }),
  {}
);

function calculateHeight(char: string): number {
  let key = char;
  if (char === 'S') {
    key = 'a';
  } else if (char === 'E') {
    key = 'z';
  }

  return heightMap[key];
}

function generateMaze(maze: string[][]): Maze {
  const rows = [];
  for (let y = 0; y < maze.length; y++) {
    const columns = [];
    for (let x = 0; x < maze[y].length; x++) {
      const char = maze[y][x];
      const coord: Coord = {
        height: calculateHeight(char),
        y,
        x,
        visitedBy: char === 'E' || char === 'S' ? char : '',
        length: 0,
      };

      columns.push(coord);
    }
    rows.push(columns);
  }

  return rows;
}

function findCoordinates(mazeStr: string[][], str: string): Position[] {
  let cords: [number, number][] = [];
  for (let y = 0; y < mazeStr.length; y++) {
    for (let x = 0; x < mazeStr[y].length; x++) {
      const char = mazeStr[y][x];
      if (char === str) {
        cords.push([y, x]);
      }
    }
  }

  return cords;
}

function isAllowedStart(currCoord: Coord, neighborCoord: Coord) {
  return currCoord.height >= neighborCoord.height - 1;
}

function isAllowedEnd(currCoord: Coord, neighborCoord: Coord) {
  return currCoord.height <= neighborCoord.height + 1;
}

function getNeighbors(
  maze: Maze,
  coord: Coord,
  isAllowed: (currCoord: Coord, neighborCoord: Coord) => boolean
): Coord[] {
  const MAX_Y = maze.length - 1;
  const MAX_X = maze[0].length - 1;

  const { x, y } = coord;

  const neighbors: Coord[] = [];

  // left
  if (x - 1 >= 0 && isAllowed(coord, maze[y][x - 1])) {
    neighbors.push(maze[y][x - 1]);
  }

  // right
  if (x + 1 <= MAX_X && isAllowed(coord, maze[y][x + 1])) {
    neighbors.push(maze[y][x + 1]);
  }

  // up
  if (y - 1 >= 0 && isAllowed(coord, maze[y - 1][x])) {
    neighbors.push(maze[y - 1][x]);
  }

  // down
  if (y + 1 <= MAX_Y && isAllowed(coord, maze[y + 1][x])) {
    neighbors.push(maze[y + 1][x]);
  }

  return neighbors;
}

function findShortestPath(
  mazeStr: string[][],
  [startY, startX]: Position,
  [endY, endX]: Position
): number {
  const maze = generateMaze(mazeStr);

  let startQueue = [maze[startY][startX]];
  let endQueue = [maze[endY][endX]];
  let steps = 0;

  while (startQueue.length || endQueue.length) {
    steps++;

    let startNeighbors: Coord[] = [];
    while (startQueue.length) {
      const coord = startQueue.shift();
      if (coord) {
        startNeighbors = startNeighbors.concat(
          getNeighbors(maze, coord, isAllowedStart)
        );
      }
    }

    for (const startNeighbor of startNeighbors) {
      if (startNeighbor.visitedBy === 'E') {
        return steps + startNeighbor.length;
      } else if (!startNeighbor.visitedBy) {
        startNeighbor.visitedBy = 'S';
        startNeighbor.length = steps;
        startQueue.push(startNeighbor);
      }
    }

    let endNeighbors: Coord[] = [];
    while (endQueue.length) {
      const coord = endQueue.shift();
      if (coord) {
        endNeighbors = endNeighbors.concat(
          getNeighbors(maze, coord, isAllowedEnd)
        );
      }
    }

    for (const endNeighbor of endNeighbors) {
      if (endNeighbor.visitedBy === 'S') {
        return steps + endNeighbor.length;
      } else if (!endNeighbor.visitedBy) {
        endNeighbor.visitedBy = 'E';
        endNeighbor.length = steps;
        endQueue.push(endNeighbor);
      }
    }
  }

  return -1;
}

export function solution1(input: string[]): number {
  const parsed = input.map((row) => row.split(''));
  const start = findCoordinates(parsed, 'S')[0];
  const end = findCoordinates(parsed, 'E')[0];

  return findShortestPath(parsed, start, end);
}

export function solution2(input: string[]) {
  const parsed = input.map((row) => row.split(''));
  const starts = [
    ...findCoordinates(parsed, 'a'),
    ...findCoordinates(parsed, 'S'),
  ];
  const end = findCoordinates(parsed, 'E')[0];

  const distances = starts.map((coord) => findShortestPath(parsed, coord, end));

  return Math.min(...distances.filter((n) => n > -1));
}
