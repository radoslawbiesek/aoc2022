import { loadList } from '../utils';
import { findTopCrates } from './index';

const testList = loadList('day5/data/test-input.txt');
const list = loadList('day5/data/input.txt');

test('day5', () => {
  expect(findTopCrates(testList)).toBe('CMZ');
  expect(findTopCrates(list)).toBe('SPFMVDTZT');

  expect(findTopCrates(testList, true)).toBe('MCD');
  expect(findTopCrates(list, true)).toBe('ZFSJBPRFP');
});
