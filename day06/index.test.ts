import { readInput } from '../utils';
import { findMarkerStart } from './index';

const testSignal = readInput('day06/data/test-input.txt')[0];
const signal = readInput('day06/data/input.txt')[0];

test('day06 findMarkerStart function', () => {
  // part1
  expect(findMarkerStart(testSignal, 4)).toBe(7);
  expect(findMarkerStart(signal, 4)).toBe(1080);

  // part2
  expect(findMarkerStart(testSignal, 14)).toBe(19);
  expect(findMarkerStart(signal, 14)).toBe(3645);
});
