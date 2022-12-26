export function fromSNAFU(snafu: string): number {
  const splitted = snafu.split('').reverse();
  let number = 0;

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === '-') {
      number -= 5 ** i;
    } else if (splitted[i] === '=') {
      number -= 2 * 5 ** i;
    } else {
      number += Number(splitted[i]) * 5 ** i;
    }
  }

  return number;
}

export function toSNAFU(num: number): string {
  let current = num;
  const remainders: number[] = [];

  while (current > 0) {
    remainders.push(current % 5);
    current = Math.floor(current / 5);
  }

  for (let i = 0; i < remainders.length; i++) {
    if (remainders[i] > 2) {
      remainders[i] = remainders[i] - 5;

      remainders[i + 1] = remainders[i + 1] ? remainders[i + 1] + 1 : 1;
    }
  }

  return remainders
    .reverse()
    .map((r) => (r === -1 ? '-' : r === -2 ? '=' : r.toString()))
    .join('');
}

export function solution(list: string[]): string {
  const sum = list.reduce((sum, snafu) => sum + fromSNAFU(snafu), 0);
  return toSNAFU(sum);
}
