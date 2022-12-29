import { readInput } from '../utils';
import { calculateHeight, calculateHeight2 } from './index';

const testInput = readInput('day17/data/test-input.txt')[0];
const input = readInput('day17/data/input.txt')[0];

test('day17', () => {
  expect(calculateHeight(testInput, 2022)).toBe(3068);
  expect(calculateHeight(input, 2022)).toBe(3179);

  expect(calculateHeight2(testInput, 1000000000000)).toBe(1514285714288);
  expect(calculateHeight2(input, 1000000000000)).toBe(1567723342929);
});
