import { readInput } from '../utils';
import { calculateHeight } from './index';

const testInput = readInput('day17/data/test-input.txt')[0];
const input = readInput('day17/data/input.txt')[0];

test('day17', () => {
  expect(calculateHeight(testInput, 2022)).toBe(3068);
  expect(calculateHeight(input, 2022)).toBe(3179);
});
