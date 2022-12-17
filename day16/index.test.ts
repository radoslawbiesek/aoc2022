import { readInput } from '../utils';
import { findTotalPressure } from './index';

const testList = readInput('day16/data/test-input.txt');
const list = readInput('day16/data/input.txt');

test('day16', () => {
  expect(findTotalPressure(testList)).toBe(1651);
  expect(findTotalPressure(list)).toBe(2181);
});
