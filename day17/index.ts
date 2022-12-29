type Position = [x: number, y: number];
type Direction = '>' | '<';

const CAVE_INITIAL_HEIGHT = 5;
const CAVE_WIDTH = 7;

class Cave {
  public grid: ('.' | '#')[][] = Array(CAVE_INITIAL_HEIGHT)
    .fill(null)
    .map(() => Array(CAVE_WIDTH).fill('.'));
  public height = 0;
  public cutRowsCount = 0;

  updateHeight() {
    const newHeight = this.grid.findIndex((row) => !row.includes('#'));
    const currentMaxHeight = this.grid.length;

    const neededSpace = 7; // space + max rock height
    if (currentMaxHeight - newHeight <= neededSpace) {
      for (let i = 0; i <= neededSpace; i++) {
        this.grid.push(Array(CAVE_WIDTH).fill('.'));
      }
    }

    this.height = newHeight + this.cutRowsCount;
  }

  cutRows() {
    let columns = Array(CAVE_WIDTH).fill('.');
    const toCutIndexes: number[] = [];
    this.grid.forEach((row, y) => {
      columns = columns.map((el, x) => (row[x] === '#' ? '#' : el));

      if (!columns.includes('.')) {
        toCutIndexes.push(y);
        columns = Array(CAVE_WIDTH).fill('.');
      }
    });

    if (toCutIndexes.length >= 4) {
      const toCut = toCutIndexes[toCutIndexes.length - 3];
      this.grid = this.grid.slice(toCut);
      this.cutRowsCount += toCut;
    }
  }

  toString(rockArea: Position[] = []) {
    const copy: ('.' | '#' | '@')[][] = this.grid.map((row) =>
      row.map((el) => el)
    );

    rockArea.forEach(([x, y]) => {
      copy[y][x] = '@';
    });

    return copy
      .map((row) => row.join(''))
      .reverse()
      .join('\n');
  }

  calculateStart(): Position {
    const height = this.grid.findIndex((row) => !row.includes('#'));
    const xStart = 2;
    const yStart = height + 3;

    return [xStart, yStart];
  }

  landRock(rockArea: Position[]) {
    rockArea.forEach(([x, y]) => {
      this.grid[y][x] = '#';
    });

    this.updateHeight();
    this.cutRows();
  }

  top5Stringified(): string {
    const firstEmpty = this.grid.findIndex((row) => !row.includes('#'));

    return this.grid
      .slice(firstEmpty - 5, firstEmpty)
      .map((row) => row.join(''))
      .join('/');
  }
}

abstract class Rock {
  public area: Position[] = [];

  constructor(private cave: Cave) {}

  move([xModifier, yModifier]: Position) {
    const newArea = this.area.map(
      ([x, y]) => [x + xModifier, y + yModifier] as Position
    );
    const canMove = newArea.every(
      ([x, y]) =>
        y >= 0 && x >= 0 && x <= CAVE_WIDTH - 1 && this.cave.grid[y][x] !== '#'
    );
    if (canMove) {
      this.area = newArea;
    }

    return canMove;
  }

  moveDown(): boolean {
    return this.move([0, -1]);
  }

  moveLeft(): boolean {
    return this.move([-1, 0]);
  }

  moveRight(): boolean {
    return this.move([1, 0]);
  }
}

class Rock1 extends Rock {
  constructor(cave: Cave) {
    super(cave);
    const [xStart, yStart] = cave.calculateStart();

    // ####
    this.area = [
      [xStart, yStart],
      [xStart + 1, yStart],
      [xStart + 2, yStart],
      [xStart + 3, yStart],
    ];
  }
}

class Rock2 extends Rock {
  constructor(cave: Cave) {
    super(cave);
    const [xStart, yStart] = cave.calculateStart();

    // .#.
    // ###
    // .#.
    this.area = [
      [xStart, yStart + 1],
      [xStart + 1, yStart],
      [xStart + 1, yStart + 1],
      [xStart + 1, yStart + 2],
      [xStart + 2, yStart + 1],
    ];
  }
}

class Rock3 extends Rock {
  constructor(cave: Cave) {
    super(cave);
    const [xStart, yStart] = cave.calculateStart();

    // ..#
    // ..#
    // ###
    this.area = [
      [xStart, yStart],
      [xStart + 1, yStart],
      [xStart + 2, yStart],
      [xStart + 2, yStart + 1],
      [xStart + 2, yStart + 2],
    ];
  }
}

class Rock4 extends Rock {
  constructor(cave: Cave) {
    super(cave);
    const [xStart, yStart] = cave.calculateStart();

    // #
    // #
    // #
    // #
    this.area = [
      [xStart, yStart + 3],
      [xStart, yStart + 2],
      [xStart, yStart + 1],
      [xStart, yStart],
    ];
  }
}

class Rock5 extends Rock {
  constructor(cave: Cave) {
    super(cave);
    const [xStart, yStart] = cave.calculateStart();

    // ##
    // ##
    this.area = [
      [xStart, yStart],
      [xStart + 1, yStart],
      [xStart, yStart + 1],
      [xStart + 1, yStart + 1],
    ];
  }
}

const RockTypes = [Rock1, Rock2, Rock3, Rock4, Rock5];

export function calculateHeight(input: string, maxRocks: number): number {
  const cave = new Cave();
  const directions = input.split('') as Direction[];
  let directionsCount = 0;
  let rocksCount = 0;

  while (rocksCount < maxRocks) {
    const RockType = RockTypes[rocksCount % RockTypes.length];
    const rock = new RockType(cave);

    let landed = false;

    while (!landed) {
      const direction = directions[directionsCount % directions.length];
      direction === '<' ? rock.moveLeft() : rock.moveRight();
      directionsCount++;

      landed = !rock.moveDown();
    }

    cave.landRock(rock.area);
    rocksCount++;
  }

  return cave.height;
}

export function calculateHeight2(input: string, maxRocks: number): number {
  const cave = new Cave();
  const directions = input.split('') as Direction[];
  let directionsCount = 0;
  let rocksCount = 0;

  const states: Set<string> = new Set();
  const cycles: [rocksCount: number, height: number][] = [];
  let firstFound = '';
  let increased = false;

  while (rocksCount < maxRocks) {
    const RockType = RockTypes[rocksCount % RockTypes.length];
    const rock = new RockType(cave);

    let landed = false;

    while (!landed) {
      const direction = directions[directionsCount % directions.length];
      direction === '<' ? rock.moveLeft() : rock.moveRight();
      directionsCount++;

      landed = !rock.moveDown();
    }

    const stringified = `
    ${rocksCount % RockTypes.length}-
    ${directionsCount % directions.length}-
    ${cave.top5Stringified()}
    `;

    if (states.has(stringified) && !firstFound) {
      firstFound = stringified;
    }

    if (stringified === firstFound) {
      cycles.push([rocksCount, cave.height]);
    }

    states.add(stringified);

    cave.landRock(rock.area);
    rocksCount++;

    // first found is an offset
    if (cycles.length === 3 && !increased) {
      const rocksInterval = cycles[2][0] - cycles[1][0];
      const heightDiff = cycles[2][1] - cycles[1][1];

      const left = maxRocks - rocksCount;
      const fullCycles = Math.floor(left / rocksInterval);

      cave.height += fullCycles * heightDiff;
      cave.cutRowsCount += fullCycles * heightDiff;
      rocksCount += fullCycles * rocksInterval;

      increased = true;
    }
  }

  return cave.height;
}
