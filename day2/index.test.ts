import {
  calculateTotalPointsStrategy1,
  calculateTotalPointsStrategy2,
} from './index';
import { loadList } from '../utils';

const testList = loadList('day2/data/test-input.txt');
const list = loadList('day2/data/input.txt');

test('day2 calculateTotalPointsStrategy1 function', () => {
  expect(calculateTotalPointsStrategy1(testList)).toBe(15);
  expect(calculateTotalPointsStrategy1(list)).toBe(8890);
});

test('day2 calculateTotalPointsStrategy2 function', () => {
  expect(calculateTotalPointsStrategy2(testList)).toBe(12);
  expect(calculateTotalPointsStrategy2(list)).toBe(10238);
});
