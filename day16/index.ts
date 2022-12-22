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

function walk(
  graph: AdjList,
  maxPressure: { value: number },
  current: number,
  totalPressure: number,
  timeRemaining: number,
  openedValves: number[]
) {
  const possiblePaths = graph[current].filter(
    (p) => !openedValves.includes(p.to) && p.distance + 1 <= timeRemaining
  );

  if (!possiblePaths.length) {
    if (totalPressure > maxPressure.value) {
      maxPressure.value = totalPressure;
    }
    return;
  }

  possiblePaths.forEach((path) =>
    walk(
      graph,
      maxPressure,
      path.to,
      totalPressure + (timeRemaining - path.distance - 1) * path.value,
      timeRemaining - path.distance - 1,
      [...openedValves, current]
    )
  );
}

export function findTotalPressure(list: string[]): number {
  const valves = parseInput(list);
  const valvesGraph = createAdjList(valves);

  const nonZeroValves = valves.filter((v) => v.flowRate > 0 || v.name === 'AA'); // valves are sorted
  const transformedGraph = transformGraph(nonZeroValves, valvesGraph);

  const SOURCE_INDEX = 0;
  const TOTAL_TIME = 30;

  const maxPressure = { value: 0 };

  walk(transformedGraph, maxPressure, SOURCE_INDEX, 0, TOTAL_TIME, []);

  return maxPressure.value;
}

function walkWithElephant(
  graph: AdjList,
  maxPressure: { value: number },
  target1: Adj | null,
  target2: Adj | null,
  timeLeft1: number,
  timeLeft2: number,
  timeRemaining: number,
  totalPressure: number,
  openedValves: number[]
): void {
  if (timeRemaining <= 0 || (!target1 && !target2)) {
    return;
  }

  if (timeLeft1 !== 0 && timeLeft2 !== 0) {
    let diff: number;
    if (target1 && target2) {
      diff = Math.min(timeLeft1, timeLeft2);
    } else if (target1) {
      diff = timeLeft1;
    } else if (target2) {
      diff = timeLeft2;
    } else {
      return;
    }
    walkWithElephant(
      graph,
      maxPressure,
      target1,
      target2,
      timeLeft1 - diff,
      timeLeft2 - diff,
      timeRemaining - diff,
      totalPressure,
      openedValves
    );
    return;
  }

  let newTotalPressure = totalPressure;
  let nextTarget1 = target1;
  let nextTarget2 = target2;

  if (timeLeft1 === 0 && target1) {
    newTotalPressure += timeRemaining * target1.value;
    nextTarget1 = null;
  }

  if (timeLeft2 === 0 && target2) {
    newTotalPressure += timeRemaining * target2.value;
    nextTarget2 = null;
  }

  if (newTotalPressure > maxPressure.value) {
    maxPressure.value = newTotalPressure;
  }

  const getPossiblePaths = (target: Adj, otherTarget?: Adj) =>
    graph[target.to].filter(
      (p) => !openedValves.includes(p.to) && p.distance + 1 <= timeRemaining
    );

  if (timeLeft1 === 0 && target1 && timeLeft2 === 0 && target2) {
    const possiblePaths1 = getPossiblePaths(target1);
    const possiblePaths2 = getPossiblePaths(target2);

    const possibleVariants =
      possiblePaths1.length &&
      possiblePaths2.length &&
      new Set([...possiblePaths1, ...possiblePaths2]).size >
        Math.max(possiblePaths1.length, possiblePaths2.length);

    if (possibleVariants) {
      possiblePaths1.forEach((path1) => {
        possiblePaths2.forEach((path2) => {
          if (path1.to !== path2.to) {
            walkWithElephant(
              graph,
              maxPressure,
              path1,
              path2,
              path1.distance + 1,
              path2.distance + 1,
              timeRemaining,
              newTotalPressure,
              [...openedValves, path1.to, path2.to]
            );
          }
        });
      });
      return;
    }
  }

  if (timeLeft1 === 0 && target1) {
    const possiblePaths1 = getPossiblePaths(target1);

    possiblePaths1.forEach((path1) => {
      walkWithElephant(
        graph,
        maxPressure,
        path1,
        nextTarget2,
        path1.distance + 1,
        timeLeft2,
        timeRemaining,
        newTotalPressure,
        [...openedValves, path1.to]
      );
    });
    if (!possiblePaths1.length && nextTarget2) {
      walkWithElephant(
        graph,
        maxPressure,
        null,
        target2,
        Infinity,
        timeLeft2,
        timeRemaining,
        newTotalPressure,
        [...openedValves]
      );
    }
  }

  if (timeLeft2 === 0 && target2) {
    const possiblePaths2 = getPossiblePaths(target2);
    possiblePaths2.forEach((path2) => {
      walkWithElephant(
        graph,
        maxPressure,
        nextTarget1,
        path2,
        timeLeft1,
        path2.distance + 1,
        timeRemaining,
        newTotalPressure,
        [...openedValves, path2.to]
      );
    });
    if (!possiblePaths2.length && nextTarget1) {
      walkWithElephant(
        graph,
        maxPressure,
        nextTarget1,
        null,
        timeLeft1,
        Infinity,
        timeRemaining,
        newTotalPressure,
        [...openedValves]
      );
    }
  }
}

export function findTotalPressure2(list: string[]): number {
  const valves = parseInput(list);
  const valvesGraph = createAdjList(valves);

  const nonZeroValves = valves.filter((v) => v.flowRate > 0 || v.name === 'AA'); // valves are sorted
  const transformedGraph = transformGraph(nonZeroValves, valvesGraph);

  const SOURCE_INDEX = 0;
  const TOTAL_TIME = 26;
  const maxPressure = { value: 0 };

  const source = transformedGraph[SOURCE_INDEX];

  for (let i = 0; i < source.length - 1; i++) {
    const target1 = source[i];
    const target2 = source[i + 1];

    walkWithElephant(
      transformedGraph,
      maxPressure,
      target1,
      target2,
      target1.distance + 1,
      target2.distance + 1,
      TOTAL_TIME,
      0,
      [SOURCE_INDEX, target1.to, target2.to]
    );
  }

  return maxPressure.value;
}
