type Position = [x: number, y: number, z: number];

function parseInput(list: string[]): Position[] {
  return list
    .map((row) => row.split(',').map(Number) as Position)
    .sort((a, b) => a[2] - b[2]);
}

function includesPosition(arr: Position[], position: Position): boolean {
  const [x, y, z] = position;
  return arr.some(([elX, elY, elZ]) => elX === x && elY === y && elZ === z);
}

function divideLayers(positions: Position[]): Position[][] {
  const grouped = positions.reduce(
    (acc: Record<number, Position[]>, position) => {
      const z = position[2];
      if (acc[z]) {
        acc[z].push(position);
      } else {
        acc[z] = [position];
      }
      return acc;
    },
    {}
  );
  return Object.values(grouped);
}

function sumSurface(positions: Position[]): number {
  const layers = divideLayers(positions);
  let total = 0;

  for (let i = 0; i < layers.length; i++) {
    const currentLayer = layers[i];
    const prevLayer = i > 0 ? layers[i - 1] : [];
    const nextLayer = i < layers.length - 1 ? layers[i + 1] : [];

    currentLayer.forEach((position) => {
      const [x, y] = position;
      let unconnectedSides = 6;

      currentLayer.forEach(([xN, yN]) => {
        if (Math.abs(yN - y) + Math.abs(xN - x) === 1) {
          unconnectedSides--;
        }
      });

      [...prevLayer, ...nextLayer].forEach(([xN, yN]) => {
        if (xN === x && yN === y) {
          unconnectedSides--;
        }
      });

      total += unconnectedSides;
    });
  }

  return total;
}

function findAirPocketsPositions(positions: Position[]): Position[] {
  const MIN_X = Math.min(...positions.map(([x]) => x));
  const MIN_Y = Math.min(...positions.map(([, y]) => y));
  const MIN_Z = Math.min(...positions.map(([, , z]) => z));

  const MAX_X = Math.max(...positions.map(([x]) => x));
  const MAX_Y = Math.max(...positions.map(([, y]) => y));
  const MAX_Z = Math.max(...positions.map(([, , z]) => z));

  const airPocketsPositions: Position[] = [];

  for (let x = 0; x <= MAX_X; x++) {
    for (let y = 0; y <= MAX_Y; y++) {
      for (let z = 0; z <= MAX_Z; z++) {
        const position = [x, y, z] as Position;
        if (includesPosition(positions, position)) {
          continue;
        }

        if (
          !isReachableByWater(
            position,
            positions,
            [MAX_X, MAX_Y, MAX_Z],
            [MIN_X, MIN_Y, MIN_Z]
          )
        ) {
          airPocketsPositions.push(position);
        }
      }
    }
  }

  return airPocketsPositions;
}

function isReachableByWater(
  position: Position,
  positions: Position[],
  max: Position,
  min: Position
): boolean {
  const [MAX_X, MAX_Y, MAX_Z] = max;
  const [MIN_X, MIN_Y, MIN_Z] = min;

  let queue: Position[] = [position];
  const seen: Position[] = [];

  // BFS
  while (queue.length) {
    const current = queue.shift() as Position;

    if (includesPosition(seen, current)) {
      continue;
    }

    seen.push(current);

    const [x, y, z] = current;

    if (
      [MIN_X - 1, MAX_X + 1].includes(x) ||
      [MIN_Y - 1, MAX_Y + 1].includes(y) ||
      [MIN_Z - 1, MAX_Z + 1].includes(z)
    ) {
      return true;
    }

    const neighbors: Position[] = [
      [x + 1, y, z], // right
      [x - 1, y, z], // left
      [x, y + 1, z], // up y
      [x, y - 1, z], // down y
      [x, y, z + 1], // up z
      [x, y, z - 1], // down z
    ];

    for (const neighbor of neighbors) {
      if (
        !includesPosition(positions, neighbor) &&
        !includesPosition(seen, neighbor)
      ) {
        queue.push(neighbor);
      }
    }
  }

  return false;
}

export function calculateSurface(list: string[]): number {
  return sumSurface(parseInput(list));
}

export function calculateSurfaceWithoutAirPockets(list: string[]): number {
  const dropletsPositions = parseInput(list);
  const airPocketsPositions = findAirPocketsPositions(dropletsPositions);

  return sumSurface(dropletsPositions) - sumSurface(airPocketsPositions);
}
