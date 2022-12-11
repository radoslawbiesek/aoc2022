import { readInput } from '../utils';
import { countLevelPart1, countLevelPart2 } from './index';

const testList = readInput('day11/data/test-input.txt', '\n\n');
const list = readInput('day11/data/input.txt', '\n\n');

test('day11 countLevel function', () => {
  expect(countLevelPart1(testList)).toBe(10605);
  expect(countLevelPart1(list)).toBe(110220);

  expect(countLevelPart2(testList)).toBe(2713310158);
  expect(countLevelPart2(list)).toBe(19457438264);
});
