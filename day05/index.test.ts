import { readInput } from '../utils';
import { findTopCrates } from './index';

const testList = readInput('day5/data/test-input.txt');
const list = readInput('day5/data/input.txt');

test('day5', () => {
  expect(findTopCrates(testList)).toBe('CMZ');
  expect(findTopCrates(list)).toBe('SPFMVDTZT');

  expect(findTopCrates(testList, true)).toBe('MCD');
  expect(findTopCrates(list, true)).toBe('ZFSJBPRFP');
});
