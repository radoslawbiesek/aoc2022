type Position = [x: number, y: number];
type PositionStr = `${number},${number}`;

class Area {
  public sensorPos: Position;
  public beaconPos: Position;
  public topPos: Position;
  public bottomPos: Position;
  public leftPos: Position;
  public rightPos: Position;
  public dim: number;

  constructor(positionStr: string) {
    const [sensorPos, beaconPos] = this.parsePosition(positionStr);

    const dim =
      Math.abs(beaconPos[1] - sensorPos[1]) +
      Math.abs(beaconPos[0] - sensorPos[0]);

    this.dim = dim;

    const [x, y] = sensorPos; // center

    this.sensorPos = sensorPos;
    this.beaconPos = beaconPos;
    this.topPos = [x, y + dim];
    this.bottomPos = [x, y - dim];
    this.leftPos = [x - dim, y];
    this.rightPos = [x + dim, y];
  }

  parsePosition(
    positionStr: string
  ): [sensorPos: Position, beaconPos: Position] {
    const [sensorStr, beaconStr] = positionStr.split(':');

    const parsePosition = (str: string) =>
      str
        .split(' ')
        .slice(-2)
        .map((posStr) => {
          let [, value] = posStr.split('=');
          if (value.includes(',')) {
            value = value.replace(',', '');
          }

          return parseInt(value);
        }) as Position;

    return [parsePosition(sensorStr), parsePosition(beaconStr)];
  }

  findRow(row: number): [xMin: number, xMax: number] | null {
    if (row > this.topPos[1] || row < this.bottomPos[1]) return null;

    const diff = Math.abs(this.sensorPos[1] - row);

    const xMin = this.leftPos[0] + diff;
    const xMax = this.rightPos[0] - diff;

    return [xMin, xMax].sort((a, b) => a - b) as [number, number];
  }
}

class Range {
  public value: [min: number, max: number][];

  constructor(min: number, max: number) {
    this.value = [[min, max]];
  }

  extend(min: number, max: number): void {
    this.value.push([min, max]);
    this.#merge();
  }

  #merge(): void {
    if (this.value.length < 2) return;

    const newValue = this.value
      .sort(([, aMax], [, bMax]) => aMax - bMax)
      .sort(([aMin], [bMin]) => aMin - bMin);

    let finished = false;
    while (!finished) {
      finished = true;
      for (let i = 0; i < newValue.length - 1; i++) {
        const current = newValue[i];
        const next = newValue[i + 1];

        if (current[1] >= next[0]) {
          newValue.splice(i, 2, [
            Math.min(current[0], next[0]),
            Math.max(current[1], next[1]),
          ]);
          finished = false;
        }
      }
    }
  }
}

function stringifyPos([x, y]: [number, number]): PositionStr {
  return `${x},${y}`;
}

function getRowStrings(
  row: number,
  [xMin, xMax]: [number, number]
): PositionStr[] {
  const rowPositions: PositionStr[] = [];

  for (let x = xMin; x <= xMax; x++) {
    rowPositions.push(stringifyPos([x, row]));
  }

  return rowPositions;
}

export function countExcludedPositions(list: string[], row: number): number {
  const areas = list.map((line) => new Area(line));

  const excluded: Set<PositionStr> = new Set(
    areas
      .reduce(
        (acc: Position[], area) => acc.concat([area.sensorPos, area.beaconPos]),
        []
      )
      .map(stringifyPos)
  );

  const rows: Set<PositionStr> = new Set(
    areas
      .reduce((acc: PositionStr[], area) => {
        const found = area.findRow(row);
        if (found) {
          return [...acc, ...getRowStrings(row, found)];
        }
        return acc;
      }, [])
      .filter((el) => el && !excluded.has(el))
  );

  return rows.size;
}

export function findTuningFrequency(
  list: string[],
  searchSpace: number
): number {
  const MULTIPLIER = 4000000;
  const areas = list.map((line) => new Area(line));

  for (let y = 0; y <= searchSpace; y++) {
    let range: Range;
    areas.forEach((area) => {
      const foundRow = area.findRow(y);
      if (foundRow) {
        if (!range) {
          range = new Range(...foundRow);
        } else {
          range.extend(...foundRow);
        }
      }
    });

    if (range!.value.length > 1) {
      // range is not complete
      const x = range!.value[1][0] - 1;
      return x * MULTIPLIER + y;
    }
  }

  return 0;
}
