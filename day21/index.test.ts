import { readInput } from '../utils';
import { solution } from './index';

const testInput = readInput('day21/data/test-input.txt');
const input = readInput('day21/data/input.txt');

test('day21', () => {
  expect(solution(testInput)).toBe(152);
  expect(solution(input)).toBe(299983725663456299983725663456);
});
