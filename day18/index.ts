type Position = [x: number, y: number, z: number];

function parseInput(list: string[]): Position[] {
  return list
    .map((row) => row.split(',').map(Number) as Position)
    .sort((a, b) => a[2] - b[2]);
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

export function calculateSurface(list: string[]): number {
  const parsed = parseInput(list);
  const layers = divideLayers(parsed);

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
