import { readInput } from '../utils';
import { findGrooveCoordinates } from './index';

const testInput = readInput('day20/data/test-input.txt');
const input = readInput('day20/data/input.txt');

test('day20', () => {
  expect(findGrooveCoordinates(testInput)).toBe(3);
  expect(findGrooveCoordinates(input)).toBe(2275);

  expect(findGrooveCoordinates(testInput, 10, 811589153)).toBe(1623178306);
  expect(findGrooveCoordinates(input, 10, 811589153)).toBe(4090409331120);
});
