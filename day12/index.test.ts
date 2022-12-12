import { readInput } from '../utils';
import { solution1, solution2 } from './index';

const testList = readInput('day12/data/test-input.txt');
const list = readInput('day12/data/input.txt');

test('day12', () => {
  expect(solution1(testList)).toBe(31);
  expect(solution1(list)).toBe(423);

  expect(solution2(testList)).toBe(29);
  expect(solution2(list)).toBe(416);
});
