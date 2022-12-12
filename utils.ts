import fs from 'fs';
import path from 'path';

export function readInput(filename: string, separator = '\n'): string[] {
  const content = fs.readFileSync(path.resolve(filename), {
    encoding: 'utf8',
  });
  const list = content.split(separator);

  return list;
}

export const LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
