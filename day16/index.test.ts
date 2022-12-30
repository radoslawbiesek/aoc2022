import { readInput } from '../utils';
import { findTotalPressure, findTotalPressure2 } from './index';

const testList = readInput('day16/data/test-input.txt');
const list = readInput('day16/data/input.txt');

test('day16', () => {
  expect(findTotalPressure(testList)).toBe(1651);
  expect(findTotalPressure(list)).toBe(2181);

  expect(findTotalPressure2(testList)).toBe(1707);
  expect(findTotalPressure2(list)).toBe(2824);
});
