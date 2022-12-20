class Node<T> {
  constructor(public value: T, public next: Node<T>, public prev: Node<T>) {}
}

class List<T> {
  public root: Node<T>;
  public length: number;
  constructor(values: T[]) {
    const tempNode = this.#createTempNode();

    this.length = values.length;

    this.root = new Node(values[0], tempNode, tempNode);
    let last = this.root;
    for (let i = 1; i < values.length; i++) {
      const node = new Node(values[i], tempNode, last);
      last.next = node;
      last = node;

      if (i === values.length - 1) {
        node.next = this.root;
        this.root.prev = node;
      }
    }
  }

  #createTempNode(): Node<T> {
    return new Node(
      null as unknown as T,
      null as unknown as Node<T>,
      null as unknown as Node<T>
    );
  }

  find(value: T): Node<T> | null {
    let current = this.root;
    while (current.value !== value) {
      current = current.next;

      if (current === this.root) {
        return null;
      }
    }

    return current;
  }

  findNthAfter(value: T, n: number): Node<T> | null {
    const node = this.find(value);
    if (!node) return null;

    let current = node;
    for (let i = 0; i < n % this.length; i++) {
      current = current.next;
    }

    return current;
  }

  move(value: T, count: number = 1): void {
    if (count === 0) return;

    const node = this.find(value);
    if (!node) return;

    for (let i = 0; i < Math.abs(count % (this.length - 1)); i++) {
      count > 0 ? this.#moveForward(node) : this.#moveBack(node);
    }
  }

  #moveForward(node: Node<T>): void {
    this.#swap(node, node.next);
  }

  #moveBack(node: Node<T>): void {
    this.#swap(node.prev, node);
  }

  #swap(nodeA: Node<T>, nodeB: Node<T>): void {
    const nodeAPrev = nodeA.prev;
    const nodeBNext = nodeB.next;

    nodeAPrev.next = nodeB;
    nodeB.prev = nodeAPrev;
    nodeB.next = nodeA;
    nodeA.prev = nodeB;
    nodeA.next = nodeBNext;
    nodeBNext.prev = nodeA;
  }

  toList(): T[] {
    const list: T[] = [this.root.value];

    let current = this.root.next;
    while (current !== this.root) {
      list.push(current.value);
      current = current.next;
    }

    return list;
  }
}

export function findGrooveCoordinates(
  list: string[],
  mixingRounds: number = 1,
  decryptionKey: number = 1
): number {
  const parsed = list.map(Number);
  const copy = parsed.map((value, index) => [value * decryptionKey, index]);
  const linkedList = new List(copy);

  for (let i = 0; i < mixingRounds; i++) {
    copy.forEach((value) => {
      linkedList.move(value, value[0]);
    });
  }

  const zero = copy.find(([v]) => v === 0)!;
  const numbers = [
    linkedList.findNthAfter(zero, 1000),
    linkedList.findNthAfter(zero, 2000),
    linkedList.findNthAfter(zero, 3000),
  ];

  return numbers.reduce(
    (sum: number, node) => (node ? sum + node.value[0] : sum),
    0
  );
}
