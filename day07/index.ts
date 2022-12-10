type Child = File | Directory;

class File {
  constructor(
    public name: string,
    public size: number,
    public parent: Directory
  ) {}
}

class Directory {
  public children: Child[] = [];
  public size: number = 0;

  constructor(public name: string, public parent: Directory | null = null) {}

  updateSize(size: number): void {
    this.size += size;
    if (this.parent) {
      this.parent.updateSize(size);
    }
  }

  find(name: string): Child | undefined {
    return this.children.find((child) => child.name === name);
  }

  addFile(fileName: string, fileSize: number): File {
    const file = new File(fileName, fileSize, this);
    this.children.push(file);
    this.updateSize(fileSize);

    return file;
  }

  #addDirectory(name: string): Directory {
    const childDir = new Directory(name, this);
    this.children.push(childDir);

    return childDir;
  }

  findOrAddDirectory(name: string): Directory {
    const found = this.find(name);
    if (found && found instanceof Directory) {
      return found;
    }

    return this.#addDirectory(name);
  }

  traverseDirs(): Directory[] {
    const list: Directory[] = [];
    const queue: Directory[] = [this];

    while (queue.length) {
      const current = queue.shift();
      if (current instanceof Directory) {
        list.push(current);

        for (const child of current.children) {
          if (child instanceof Directory) {
            queue.push(child);
          }
        }
      }
    }

    return list;
  }
}

export function buildFilesystem(commands: string[]): Directory {
  const root = new Directory('root');
  let cwd = root;

  commands.slice(1).forEach((command) => {
    if (command.startsWith('$ cd')) {
      const dirName = command.split(' ')[2];

      if (dirName === '..' && cwd.parent) {
        cwd = cwd.parent;
      } else {
        cwd = cwd.findOrAddDirectory(dirName);
      }
    }

    if (String(parseInt(command.charAt(0))) === command.charAt(0)) {
      const [size, fileName] = command.split(' ');
      cwd.addFile(fileName, parseInt(size));
    }
  });

  return root;
}

// Part 1
const MAX_SIZE = 100000;

export function findTotalSum(commands: string[]): number {
  const root = buildFilesystem(commands);
  const dirList = root.traverseDirs();

  return dirList
    .filter((item) => item.size < MAX_SIZE)
    .reduce((sum, item) => sum + item.size, 0);
}

// Part 2
const TOTAL_SPACE = 70000000;
const NEEDED_UNUSED_SPACE = 30000000;

export function findDirectoryToDelete(commands: string[]): number {
  const root = buildFilesystem(commands);
  const dirList = root.traverseDirs();

  const unusedSpace = TOTAL_SPACE - root.size;
  const spaceToFree = NEEDED_UNUSED_SPACE - unusedSpace;

  let dirToDelete = dirList[0];
  dirList.slice(1).forEach((item) => {
    if (item.size > spaceToFree && item.size < dirToDelete.size) {
      dirToDelete = item;
    }
  });

  return dirToDelete.size;
}
