import {
  countFullyOverlappingPairs,
  countPartiallyOverlappingPairs,
} from './index';
import { loadList } from '../utils';

const testList = loadList('day4/data/test-input.txt');
const list = loadList('day4/data/input.txt');

test('day4 countFullyOverlappingPairs function', () => {
  expect(countFullyOverlappingPairs(testList)).toBe(2);
  expect(countFullyOverlappingPairs(list)).toBe(556);
});

test('day4 countPartiallyOverlappingPairs function', () => {
  expect(countPartiallyOverlappingPairs(testList)).toBe(4);
  expect(countPartiallyOverlappingPairs(list)).toBe(876);
});
