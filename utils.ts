import fs from 'fs';
import path from 'path';

export function loadList(filename: string): string[] {
  const content = fs.readFileSync(path.resolve(filename), {
    encoding: 'utf8',
  });
  const list = content.split('\n');

  return list;
}
