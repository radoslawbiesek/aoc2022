type MonkeyInput = [monkeyName: string, value: number | MonkeyOperation];

type MonkeyOperation = [
  monkeyName1: string,
  operator: '+' | '-' | '*' | '/',
  monkeyName2: string
];

type Monkey = OpMonkey | NumMonkey;

class Tree {
  public root: OpMonkey;
  constructor(list: string[]) {
    const monkeysInput = this.#parseInput(list);
    this.root = this.#createMonkey(
      monkeysInput,
      'root',
      null
    ) as unknown as OpMonkey;
  }

  #createMonkey(
    monkeysInput: MonkeyInput[],
    name: string,
    parent: OpMonkey | null
  ): Monkey {
    const monkeyInput = monkeysInput.find(([n]) => n === name)!;

    const [, input] = monkeyInput;

    if (typeof input === 'number') {
      return new NumMonkey(name, input, parent as OpMonkey);
    } else {
      const opMonkey = new OpMonkey(name, input[1], parent);
      opMonkey.left = this.#createMonkey(monkeysInput, input[0], opMonkey);
      opMonkey.right = this.#createMonkey(monkeysInput, input[2], opMonkey);

      return opMonkey;
    }
  }

  #parseInput(list: string[]): MonkeyInput[] {
    return list.map((line) => {
      const [monkeyName, value] = line.split(':');

      if (!isNaN(Number(value))) {
        return [monkeyName, Number(value)];
      }

      return [monkeyName, value.split(' ').filter((v) => v) as MonkeyOperation];
    });
  }

  #findPath(name: string, currPath: Monkey[], result: Monkey[]): void {
    const node = currPath[currPath.length - 1];
    if (!node) return;

    if (node.name === name) {
      result.push(...currPath.reverse());
      return;
    }

    if (node instanceof OpMonkey) {
      if (node.left) {
        this.#findPath(name, [...currPath, node.left], result);
      }
      if (node.right) {
        this.#findPath(name, [...currPath, node.right], result);
      }
    }
  }

  find(name: string): Monkey {
    const path: Monkey[] = [];
    this.#findPath(name, [this.root], path);

    return path[0];
  }
}

class NumMonkey {
  constructor(
    public name: string,
    public value: number,
    public parent: OpMonkey
  ) {}

  getValue(): number {
    return this.value;
  }

  solve() {
    return this.parent.solve(this);
  }
}

class OpMonkey {
  public left?: Monkey;
  public right?: Monkey;
  constructor(
    public name: string,
    public operator: '+' | '-' | '*' | '/',
    public parent: OpMonkey | null
  ) {}

  getValue(): number {
    if (!this.left || !this.right) throw new Error();

    switch (this.operator) {
      case '+':
        return this.left.getValue() + this.right.getValue();
      case '-':
        return this.left.getValue() - this.right.getValue();
      case '*':
        return this.left.getValue() * this.right.getValue();
      case '/':
        return Math.floor(this.left.getValue() / this.right.getValue());
    }
  }

  solve(child: Monkey): number {
    if (!this.left || !this.right) throw new Error();

    const childPos: 'left' | 'right' = child === this.left ? 'left' : 'right';
    const otherChild = child === this.left ? this.right : this.left;

    if (!this.parent) {
      return otherChild.getValue();
    }

    switch (this.operator) {
      case '+':
        return this.parent.solve(this) - otherChild.getValue();
      case '-':
        if (childPos === 'left') {
          return this.parent.solve(this) + otherChild.getValue();
        } else {
          return otherChild.getValue() - this.parent.solve(this);
        }
      case '*':
        return Math.floor(this.parent.solve(this) / otherChild.getValue());
      case '/':
        if (childPos === 'left') {
          return this.parent.solve(this) * otherChild.getValue();
        } else {
          return otherChild.getValue() / this.parent.solve(this);
        }
    }
  }
}

export function findRootNumber(list: string[]): number {
  const tree = new Tree(list);
  return tree.root.getValue();
}

export function findHumanNumber(list: string[]): number {
  const tree = new Tree(list);
  const human = tree.find('humn') as NumMonkey;
  return human.solve();
}
