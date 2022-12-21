type Monkey = [monkeyName: string, value: number | MonkeyOperation];

type MonkeyOperation = [
  monkeyName1: string,
  operator: '+' | '-' | '*' | '/',
  monkeyName2: string
];

function parseInput(list: string[]): Monkey[] {
  return list.map((line) => {
    const [monkeyName, value] = line.split(':');

    if (!isNaN(Number(value))) {
      return [monkeyName, Number(value)];
    }

    return [monkeyName, value.split(' ').filter((v) => v) as MonkeyOperation];
  });
}

export function solution(list: string[]): number {
  const monkeys = parseInput(list);
  const resultMap: Record<string, number> = {};

  const queue = [...monkeys];

  while (queue.length) {
    const monkey = queue.shift() as Monkey;
    if (typeof monkey[1] === 'number') {
      resultMap[monkey[0]] = monkey[1];
    } else {
      const [monkey1, operator, monkey2] = monkey[1];
      if (resultMap[monkey1] && resultMap[monkey2]) {
        if (operator === '+') {
          resultMap[monkey[0]] = resultMap[monkey1] + resultMap[monkey2];
        }

        if (operator === '-') {
          resultMap[monkey[0]] = resultMap[monkey1] - resultMap[monkey2];
        }

        if (operator === '*') {
          resultMap[monkey[0]] = resultMap[monkey1] * resultMap[monkey2];
        }

        if (operator === '/') {
          resultMap[monkey[0]] = resultMap[monkey1] / resultMap[monkey2];
        }
      } else {
        queue.push(monkey);
      }
    }
  }

  return resultMap.root;
}
