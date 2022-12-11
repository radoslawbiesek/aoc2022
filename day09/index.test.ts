import { readInput } from '../utils';
import { countVisited } from './index';

const testList = readInput('day09/data/test-input.txt');
const testList2 = readInput('day09/data/test-input2.txt');
const list = readInput('day09/data/input.txt');

test('day09 countVisited function', () => {
  expect(countVisited(testList, 2)).toBe(13);
  expect(countVisited(list, 2)).toBe(6090);

  expect(countVisited(testList, 10)).toBe(1);
  expect(countVisited(testList2, 10)).toBe(36);
  expect(countVisited(list, 10)).toBe(2566);
});
