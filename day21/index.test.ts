import { readInput } from '../utils';
import { findRootNumber, findHumanNumber } from './index';

const testInput = readInput('day21/data/test-input.txt');
const input = readInput('day21/data/input.txt');

test('day21', () => {
  expect(findRootNumber(testInput)).toBe(152);
  expect(findRootNumber(input)).toBe(299983725663456);

  expect(findHumanNumber(testInput)).toBe(301);
  expect(findHumanNumber(input)).toBe(3093175982595);
});
