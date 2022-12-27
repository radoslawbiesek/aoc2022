import { readInput } from '../utils';
import { solution } from './index';

const testInput = readInput('day22/data/test-input.txt');
const input = readInput('day22/data/input.txt');

test('day22', () => {
  expect(solution(testInput)).toBe(6032);
  expect(solution(input)).toBe(77318);
});
