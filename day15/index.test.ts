import { readInput } from '../utils';
import { countExcludedPositions, findTuningFrequency } from './index';

const testList = readInput('day15/data/test-input.txt');
const list = readInput('day15/data/input.txt');

test('day15', () => {
  expect(countExcludedPositions(testList, 10)).toBe(26);
  expect(countExcludedPositions(list, 2000000)).toBe(4876693);

  expect(findTuningFrequency(testList, 20)).toBe(56000011);
  expect(findTuningFrequency(list, 4000000)).toBe(11645454855041);
});
