type Map = number[][];

function generateMap(list: string[]): Map {
  return list.map((row) => row.split('').map((str) => Number(str)));
}

// Part 1

export function countVisibleTrees(list: string[]): number {
  const map = generateMap(list);

  let total = 0;
  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    for (let colIndex = 0; colIndex < map.length; colIndex++) {
      if (
        [
          isBottomVisible(map, colIndex, rowIndex),
          isTopVisible(map, colIndex, rowIndex),
          isLeftVisible(map[rowIndex], colIndex),
          isRightVisible(map[rowIndex], colIndex),
        ].includes(true)
      ) {
        total++;
      }
    }
  }

  return total;
}

function isLeftVisible(row: number[], colIndex: number): boolean {
  const tree = row[colIndex];
  const left = row.slice(0, colIndex);

  return Math.max(...left) < tree;
}

function isRightVisible(row: number[], colIndex: number): boolean {
  const tree = row[colIndex];
  const right = row.slice(colIndex + 1);

  return Math.max(...right) < tree;
}

function isTopVisible(map: Map, colIndex: number, rowIndex: number): boolean {
  const columnArray = map.map((rowArr) => rowArr[colIndex]);

  return isLeftVisible(columnArray, rowIndex);
}

function isBottomVisible(
  map: Map,
  colIndex: number,
  rowIndex: number
): boolean {
  const columnArray = map.map((rowArr) => rowArr[colIndex]);

  return isRightVisible(columnArray, rowIndex);
}

// Part2

export function findBestScore(list: string[]): number {
  const map = generateMap(list);

  let highestScore = 0;
  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    for (let colIndex = 0; colIndex < map.length; colIndex++) {
      const score =
        countBottomVisible(map, colIndex, rowIndex) *
        countTopVisible(map, colIndex, rowIndex) *
        countLeftVisible(map[rowIndex], colIndex) *
        countRightVisible(map[rowIndex], colIndex);

      if (score > highestScore) {
        highestScore = score;
      }
    }
  }

  return highestScore;
}

function countRightVisible(row: number[], colIndex: number): number {
  const tree = row[colIndex];
  const right = row.slice(colIndex + 1);

  let visible = 0;
  for (let i = 0; i < right.length; i++) {
    visible++;
    if (tree <= right[i]) {
      break;
    }
  }

  return visible;
}

function countLeftVisible(row: number[], colIndex: number): number {
  const tree = row[colIndex];
  const left = row.slice(0, colIndex + 1);

  let visible = 0;
  for (let i = colIndex - 1; i >= 0; i--) {
    visible++;
    if (tree <= left[i]) {
      break;
    }
  }

  return visible;
}

function countTopVisible(map: Map, colIndex: number, rowIndex: number): number {
  const columnArray = map.map((rowArr) => rowArr[colIndex]);

  return countLeftVisible(columnArray, rowIndex);
}

function countBottomVisible(
  map: Map,
  colIndex: number,
  rowIndex: number
): number {
  const columnArray = map.map((rowArr) => rowArr[colIndex]);

  return countRightVisible(columnArray, rowIndex);
}
