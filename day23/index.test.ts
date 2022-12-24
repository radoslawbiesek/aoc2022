import { readInput } from '../utils';
import { countEmptyTiles, countRounds } from './index';

const testInput = readInput('day23/data/test-input.txt');
const input = readInput('day23/data/input.txt');

test('day23', () => {
  expect(countEmptyTiles(testInput)).toBe(110);
  expect(countEmptyTiles(input)).toBe(4091);

  expect(countRounds(testInput)).toBe(20);
  expect(countRounds(input)).toBe(1036);
});
