import { readInput } from '../utils';
import { calculateSurface, calculateSurfaceWithoutAirPockets } from './index';

const testInput = readInput('day18/data/test-input.txt');
const input = readInput('day18/data/input.txt');

test('day18', () => {
  expect(calculateSurface(testInput)).toBe(64);
  expect(calculateSurface(input)).toBe(4482);

  expect(calculateSurfaceWithoutAirPockets(testInput)).toBe(58);
  expect(calculateSurfaceWithoutAirPockets(input)).toBe(2576);
});
