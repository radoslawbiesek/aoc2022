type Position = [y: number, x: number];
type Element = 'o' | '#' | '+';
type ElementMap = Record<`${number},${number}`, Element>;

class Cave {
  readonly sandSource: Position = [0, 500];
  public maxY: number;
  public elementMap: ElementMap = {};

  constructor(list: string[]) {
    const rockPaths = this.parseInput(list);
    this.maxY = Math.max(...rockPaths.flat().map(([y]) => y));
    this.createElementMap(rockPaths);
  }

  parseInput(list: string[]): Position[][] {
    const parsed = list.map((row) => {
      return row.split('->').map((str) => {
        return str.trim().split(',').map(Number).reverse() as Position;
      });
    });

    return parsed;
  }

  createElementMap(rockPaths: Position[][]) {
    rockPaths.forEach((line) => {
      for (let i = 0; i < line.length - 1; i++) {
        const [startY, startX] = line[i];
        const [endY, endX] = line[i + 1];

        if (startX - endX === 0) {
          for (
            let y = Math.min(startY, endY);
            y <= Math.max(startY, endY);
            y++
          ) {
            this.setElement(y, startX, '#');
          }
        } else {
          for (
            let x = Math.min(startX, endX);
            x <= Math.max(startX, endX);
            x++
          ) {
            this.setElement(startY, x, '#');
          }
        }
      }
    });
  }

  getElement(y: number, x: number) {
    return this.elementMap[`${y},${x}`];
  }

  setElement(y: number, x: number, el: Element) {
    this.elementMap[`${y},${x}`] = el;
  }

  addSand(): boolean {
    let [y, x] = this.sandSource;

    while (true) {
      if (this.getElement(this.sandSource[0], this.sandSource[1]) === 'o') {
        return false;
      }

      if (y >= this.maxY) return false;

      if (!this.getElement(y + 1, x)) {
        y++;
      } else if (!this.getElement(y + 1, x - 1)) {
        y++;
        x--;
      } else if (!this.getElement(y + 1, x + 1)) {
        y++;
        x++;
      } else {
        this.setElement(y, x, 'o');
        return true;
      }
    }
  }

  fillWithSand(): number {
    let total = 0;
    let isFull = false;
    while (!isFull) {
      isFull = !this.addSand();
      if (!isFull === true) total++;
    }
    return total;
  }
}

class CaveWithFloor extends Cave {
  constructor(list: string[]) {
    super(list);
    this.maxY = this.maxY + 2;
  }

  getElement(y: number, x: number): Element {
    if (y === this.maxY) return '#';
    return super.getElement(y, x);
  }
}

export function solution(list: string[]): number {
  const cave = new Cave(list);
  return cave.fillWithSand();
}

export function solution2(list: string[]): number {
  const cave = new CaveWithFloor(list);
  return cave.fillWithSand();
}
