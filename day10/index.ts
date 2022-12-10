function execute(
  instructions: string[],
  callback: (cycle: number, X: number) => void
): void {
  const queue = [...instructions];

  let X = 1;
  let cycle = 1;

  while (queue.length) {
    const instruction = queue.shift();

    callback(cycle, X);

    if (instruction?.startsWith('add')) {
      const value = instruction.split(' ')[1];

      if (instruction.startsWith('addx')) {
        queue.unshift(`add ${value}`);
      } else {
        X += Number(value);
      }
    }

    cycle++;
  }
}

export function findTotalSignalStrength(instructions: string[]): number {
  let strength = 0;

  execute(instructions, (cycle, X) => {
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      strength += cycle * X;
    }
  });

  return strength;
}

export function drawImage(instructions: string[]): string {
  const CRT_WIDTH = 40;
  const CRT_HEIGHT = 6;
  const pixels: ('.' | '#')[][] = Array(CRT_HEIGHT)
    .fill(null)
    .map(() => []);

  execute(instructions, (cycle, X) => {
    const index = cycle - 1;
    const spriteIndexes = [X - 1, X, X + 1];

    const row = Math.floor(index / CRT_WIDTH);
    const rowIndex = index % CRT_WIDTH;

    pixels[row].push(spriteIndexes.includes(rowIndex) ? '#' : '.');
  });

  return '\n' + pixels.map((row) => row.join('')).join('\n') + '\n';
}
