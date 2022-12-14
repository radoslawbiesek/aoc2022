import { readInput } from '../utils';
import { solution, solution2 } from './index';

const testList = readInput('day14/data/test-input.txt');
const list = readInput('day14/data/input.txt');

test('day14', () => {
  expect(solution(testList)).toBe(24);
  expect(solution(list)).toBe(1072);

  expect(solution2(testList)).toBe(93);
  expect(solution2(list)).toBe(24659);
});
