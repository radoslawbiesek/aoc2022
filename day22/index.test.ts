import { readInput } from '../utils';
import { solution, solution2t, solution2 } from './index';

const testInput = readInput('day22/data/test-input.txt');
const input = readInput('day22/data/input.txt');

test('day22', () => {
  expect(solution(testInput)).toBe(6032);
  expect(solution(input)).toBe(77318);

  expect(solution2t(testInput)).toBe(5031);
  expect(solution2(input)).toBe(111030); // last answer = too low
});
