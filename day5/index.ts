type Instruction = [MoveCount: number, From: number, To: number];
type Crate = string[];

const SLICE_LEN = 4;
const LETTER_INDEX = 1;

function isLetter(char: string): boolean {
  return char.toLowerCase() !== char.toUpperCase();
}

function getCrateArrays(list: string[]): Crate[] {
  const stackRows = list
    .filter((el) => !['1', 'm'].includes(el.trimStart().charAt(0)))
    .slice(0, -1)
    .map((el) => el.trimEnd());

  const crates: string[][] = [];

  stackRows.forEach((stackRow) => {
    const columns = stackRow.length / SLICE_LEN;

    for (let col = 0; col < columns; col++) {
      if (!Array.isArray(crates[col])) {
        crates[col] = [];
      }
      const slice = stackRow.slice(col * SLICE_LEN, (col + 1) * SLICE_LEN);
      const char = slice.charAt(LETTER_INDEX);

      if (isLetter(char)) {
        crates[col].unshift(char);
      }
    }
  });

  return crates;
}

function getInstructions(list: string[]): Instruction[] {
  const instructionsList = list.filter((el) => el.substring(0, 4) === 'move');

  return instructionsList.map((instructionStr) => {
    const [, move, , from, , to] = instructionStr.split(' ');

    return [move, from, to].map((el) => parseInt(el)) as Instruction;
  });
}

export function moveCrates(
  crates: Crate[],
  instructions: Instruction[],
  multipleMoving = false
): Crate[] {
  instructions.forEach((instruction) => {
    const [moveCount, from, to] = instruction;
    const elementsToMove = crates[from - 1].splice(-moveCount, moveCount);

    if (multipleMoving) {
      crates[to - 1] = [...crates[to - 1], ...elementsToMove];
    } else {
      crates[to - 1].push(...elementsToMove.reverse());
    }
  });

  return crates;
}

export function findTopCrates(list: string[], multipleMoving: boolean = false) {
  const crates = getCrateArrays(list);
  const instructions = getInstructions(list);

  const cratesAfterMoving = moveCrates(crates, instructions, multipleMoving);

  return cratesAfterMoving.reduce(
    (str, column) => str + column[column.length - 1],
    ''
  );
}
