import { sumCalories } from './index';
import { readInput } from '../utils';

const testList = readInput('day1/data/test-input.txt');
const list = readInput('day1/data/input.txt');

test('day1 sumCalories function', () => {
  expect(sumCalories(testList, 1)).toBe(24000);
  expect(sumCalories(testList, 3)).toBe(45000);

  expect(sumCalories(list, 1)).toBe(69836);
  expect(sumCalories(list, 3)).toBe(207968);
});
