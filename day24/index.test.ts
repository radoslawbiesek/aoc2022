import { readInput } from '../utils';
import { solution1, solution2 } from './index';

const testInput = readInput('day24/data/test-input.txt');
const input = readInput('day24/data/input.txt');

test('day24', () => {
  expect(solution1(testInput)).toBe(18);
  expect(solution1(input)).toBe(230);

  expect(solution2(testInput)).toBe(54);
  expect(solution2(input)).toBe(713);
});
