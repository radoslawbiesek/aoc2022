import { readInput } from '../utils';
import { findTotalSum, findDirectoryToDelete } from './index';

const testList = readInput('day07/data/test-input.txt');
const list = readInput('day07/data/input.txt');

test('day07', () => {
  expect(findTotalSum(testList)).toBe(95437);
  expect(findTotalSum(list)).toBe(1391690);

  expect(findDirectoryToDelete(testList)).toBe(24933642);
  expect(findDirectoryToDelete(list)).toBe(5469168);
});
