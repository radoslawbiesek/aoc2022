import {
  calculateTotalPointsStrategy1,
  calculateTotalPointsStrategy2,
} from './index';
import { readInput } from '../utils';

const testList = readInput('day02/data/test-input.txt');
const list = readInput('day02/data/input.txt');

test('day02 calculateTotalPointsStrategy1 function', () => {
  expect(calculateTotalPointsStrategy1(testList)).toBe(15);
  expect(calculateTotalPointsStrategy1(list)).toBe(8890);
});

test('day02 calculateTotalPointsStrategy2 function', () => {
  expect(calculateTotalPointsStrategy2(testList)).toBe(12);
  expect(calculateTotalPointsStrategy2(list)).toBe(10238);
});
