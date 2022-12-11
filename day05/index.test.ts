import { readInput } from '../utils';
import { findTopCrates } from './index';

const testList = readInput('day05/data/test-input.txt');
const list = readInput('day05/data/input.txt');

test('day05', () => {
  expect(findTopCrates(testList)).toBe('CMZ');
  expect(findTopCrates(list)).toBe('SPFMVDTZT');

  expect(findTopCrates(testList, true)).toBe('MCD');
  expect(findTopCrates(list, true)).toBe('ZFSJBPRFP');
});
