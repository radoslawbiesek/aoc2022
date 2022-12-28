import { readInput } from '../utils';
import { solution, solution2 } from './index';

const testInput = readInput('day19/data/test-input.txt');
const input = readInput('day19/data/input.txt');

test('day19', () => {
  expect(solution(testInput)).toBe(33);
  expect(solution(input)).toBe(1177);

  expect(solution2(testInput)).toBe(3472);
  expect(solution2(input)).toBe(62744);
});
