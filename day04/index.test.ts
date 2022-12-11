import {
  countFullyOverlappingPairs,
  countPartiallyOverlappingPairs,
  PairStr,
} from './index';
import { readInput } from '../utils';

const testList = readInput('day04/data/test-input.txt') as PairStr[];
const list = readInput('day04/data/input.txt') as PairStr[];

test('day04 countFullyOverlappingPairs function', () => {
  expect(countFullyOverlappingPairs(testList)).toBe(2);
  expect(countFullyOverlappingPairs(list)).toBe(556);
});

test('day04 countPartiallyOverlappingPairs function', () => {
  expect(countPartiallyOverlappingPairs(testList)).toBe(4);
  expect(countPartiallyOverlappingPairs(list)).toBe(876);
});
