import fs from 'fs';
import path from 'path';

export function readInput(filename: string, separator = '\n'): string[] {
  const content = fs.readFileSync(path.resolve(filename), {
    encoding: 'utf8',
  });
  const list = content.split(separator);

  return list;
}
