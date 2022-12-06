import { readInput } from '../utils';
import { findMarkerStart } from './index';

const testSignal = readInput('day6/data/test-input.txt')[0];
const signal = readInput('day6/data/input.txt')[0];

test('day6 findMarkerStart function', () => {
  // part1
  expect(findMarkerStart(testSignal, 4)).toBe(7);
  expect(findMarkerStart(signal, 4)).toBe(1080);

  // part2
  expect(findMarkerStart(testSignal, 14)).toBe(19);
  expect(findMarkerStart(signal, 14)).toBe(3645);
});
