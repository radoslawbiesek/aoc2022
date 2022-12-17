type Valve = {
  name: string;
  flowRate: number;
  tunnels: string[];
};
type Adj = { to: number; distance: number; value: number };
type AdjList = Adj[][];

function parseInput(list: string[]): Valve[] {
  const parsed = list.reduce((acc: Valve[], line) => {
    const [name, ...tunnels] = line
      .split(' ')
      .filter((token) => token === token.toUpperCase())
      .map((name) => (name.endsWith(',') ? name.slice(0, -1) : name));

    const flowRate = parseInt(line.split(';')[0].split('=')[1]);

    return [...acc, { name, flowRate, tunnels }];
  }, []);

  // the first element is the source, the rest is sorted by flow rate
  const sourceIndex = parsed.findIndex((v) => v.name === 'AA');
  const source = parsed[sourceIndex];
  parsed.splice(sourceIndex, 1);
  const sorted = [source, ...parsed.sort((a, b) => b.flowRate - a.flowRate)];

  return sorted;
}

function createAdjList(valves: Valve[]): AdjList {
  const list: AdjList = [];
  valves.forEach((v) => {
    list.push([
      ...v.tunnels.map((toName) => {
        const toIndex = valves.findIndex((v) => v.name === toName);
        return {
          to: toIndex,
          distance: 1,
          value: valves[toIndex].flowRate,
        };
      }),
    ]);
  });

  return list;
}

function hasUnvisited(seen: boolean[], dists: number[]): boolean {
  return seen.some((s, i) => !s && dists[i] < Infinity);
}

function getLowestUnvisited(seen: boolean[], dists: number[]): number {
  let index = -1;
  let lowestDistance = Infinity;

  for (let i = 0; i < seen.length; i++) {
    if (seen[i]) {
      continue;
    }

    if (dists[i] < Infinity && lowestDistance > dists[i]) {
      lowestDistance = dists[i];
      index = i;
    }
  }

  return index;
}

function dijkstraList(source: number, graph: AdjList): number[] {
  const seen = new Array(graph.length).fill(false);
  const dists = new Array(graph.length).fill(Infinity);

  dists[source] = 0;

  while (hasUnvisited(seen, dists)) {
    const curr = getLowestUnvisited(seen, dists);
    seen[curr] = true;

    const adjs = graph[curr];
    for (let i = 0; i < adjs.length; i++) {
      const edge = adjs[i];
      if (seen[edge.to]) {
        continue;
      }

      const dist = dists[curr] + edge.distance;
      if (dist < dists[edge.to]) {
        dists[edge.to] = dist;
      }
    }
  }

  return dists;
}

function transformGraph(valves: Valve[], graph: AdjList): AdjList {
  const newGraph: AdjList = [];

  for (let i = 0; i <= valves.length; i++) {
    const distances = dijkstraList(i, graph);

    newGraph.push(
      [
        ...distances.slice(0, valves.length).map((distance, index) => ({
          to: index,
          distance: distance,
          value: valves[index].flowRate,
        })),
      ].filter((obj) => obj.to !== i)
    );
  }

  return newGraph;
}

class Branch {
  constructor(
    public currentValve: number,
    public totalPressure: number,
    public timeRemaining: number,
    public openedValves: number[]
  ) {}
}

export function findTotalPressure(list: string[]): number {
  const valves = parseInput(list);
  const valvesGraph = createAdjList(valves);

  const nonZeroValves = valves.filter((v) => v.flowRate > 0 || v.name === 'AA'); // valves are sorted
  const transformedGraph = transformGraph(nonZeroValves, valvesGraph);

  const SOURCE_INDEX = 0;
  const TOTAL_TIME = 30;

  let queue: Branch[] = [];
  let maxTotalPressure = 0;

  queue.push(new Branch(SOURCE_INDEX, 0, TOTAL_TIME, [SOURCE_INDEX]));

  while (queue.length) {
    const { currentValve, timeRemaining, totalPressure, openedValves } =
      queue.shift() as Branch;

    const possiblePaths = transformedGraph[currentValve].filter((path) => {
      return (
        !openedValves.includes(path.to) && path.distance + 1 < timeRemaining
      );
    });

    if (!possiblePaths.length) {
      // branch is ended
      if (totalPressure > maxTotalPressure) {
        maxTotalPressure = totalPressure;
      }
    } else {
      possiblePaths.forEach((path) => {
        queue.push(
          new Branch(
            path.to,
            totalPressure + (timeRemaining - path.distance - 1) * path.value,
            timeRemaining - path.distance - 1,
            [...openedValves, currentValve]
          )
        );
      });
    }
  }

  return maxTotalPressure;
}
