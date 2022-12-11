import { readInput } from '../utils';
import { countVisibleTrees, findBestScore } from './index';

const testList = readInput('day08/data/test-input.txt');
const list = readInput('day08/data/input.txt');

test('day08', () => {
  expect(countVisibleTrees(testList)).toBe(21);
  expect(countVisibleTrees(list)).toBe(1543);

  expect(findBestScore(testList)).toBe(8);
  expect(findBestScore(list)).toBe(595080);
});
