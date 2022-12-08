import { readInput } from '../utils';
import { countVisibleTrees, findBestScore } from './index';

const testList = readInput('day8/data/test-input.txt');
const list = readInput('day8/data/input.txt');

test('day7', () => {
  expect(countVisibleTrees(testList)).toBe(21);
  expect(countVisibleTrees(list)).toBe(1543);

  expect(findBestScore(testList)).toBe(8);
  expect(findBestScore(list)).toBe(595080);
});
