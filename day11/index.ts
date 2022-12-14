type AllowedOperation =
  | { sign: '+'; value: number }
  | { sign: '*'; value: number }
  | { sign: '**'; value: 2 };

class Operation {
  public operation: AllowedOperation;

  constructor(operationStr: string) {
    const [, sign, value] = operationStr.split('=')[1].trim().split(' ');
    if (value === 'old') {
      this.operation = {
        sign: '**',
        value: 2,
      };
    } else {
      this.operation = {
        sign: sign.trim(),
        value: Number(value),
      } as AllowedOperation;
    }
  }

  execute(num: number): number {
    if (this.operation.sign === '+') {
      return num + this.operation.value;
    } else if (this.operation.sign === '**') {
      return num ** this.operation.value;
    } else {
      return num * this.operation.value;
    }
  }
}

class Monkey {
  public inspected = 0;
  private operation: Operation;

  constructor(
    public index: number,
    public items: number[],
    operationStr: string,
    public divisor: number,
    private trueTarget: number,
    private falseTarget: number,
    public monkeys: Monkey[]
  ) {
    this.operation = new Operation(operationStr);
  }

  inspectItem(item: number): [newItem: number, target: number] {
    let newItem = item;

    newItem = this.operation.execute(newItem);
    newItem = this.reduce(newItem);

    const target =
      newItem % this.divisor === 0 ? this.trueTarget : this.falseTarget;

    this.inspected++;
    return [newItem, target];
  }

  throwItems() {
    while (this.items.length) {
      const toThrow = this.items.shift();

      if (toThrow) {
        const [item, target] = this.inspectItem(toThrow);
        this.monkeys[target].catchItem(item);
      }
    }
  }

  catchItem(item: number) {
    this.items.push(item);
  }

  reduce(num: number): number {
    return Math.floor(num / 3);
  }
}

class AngryMonkey extends Monkey {
  reduce(num: number): number {
    const divisors = this.monkeys.map((m) => m.divisor);
    const divisor = divisors.reduce((acc, div) => acc * div, 1);

    return num % divisor;
  }
}

function createMonkeys(list: string[], conctructor: typeof Monkey): Monkey[] {
  const monkeys: Monkey[] = [];

  list.forEach((monkeyStr, index) => {
    const arr = monkeyStr.split('\n');
    const items = arr[1].split(':')[1].split(',').map(Number);
    const operationStr = arr[2];
    const divisor = Number(arr[3].split(' ').reverse()[0]);
    const trueTarget = Number(arr[4].split(' ').reverse()[0]);
    const falseTarget = Number(arr[5].split(' ').reverse()[0]);

    const monkey = new conctructor(
      index,
      items,
      operationStr,
      divisor,
      trueTarget,
      falseTarget,
      monkeys
    );

    monkeys.push(monkey);
  });

  return monkeys;
}

function countLevel(rounds: number, conctructor: typeof Monkey) {
  return function (list: string[]): number {
    const monkeys = createMonkeys(list, conctructor);

    let round = 1;
    while (round <= rounds) {
      monkeys.forEach((monkey, index) => {
        monkey.throwItems();
      });

      round++;
    }

    const mostActive = monkeys
      .map((m) => m.inspected)
      .sort((a, b) => b - a)
      .slice(0, 2);

    return mostActive[0] * mostActive[1];
  };
}

export const countLevelPart1 = countLevel(20, Monkey);
export const countLevelPart2 = countLevel(10000, AngryMonkey);
