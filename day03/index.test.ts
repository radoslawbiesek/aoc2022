import { sumDoubledItemsPriorities, sumBadgesPriorities } from './index';
import { readInput } from '../utils';

const testList = readInput('day03/data/test-input.txt');
const list = readInput('day03/data/input.txt');

test('day03 sumDoubledItemsPriorities function', () => {
  expect(sumDoubledItemsPriorities(testList)).toBe(157);
  expect(sumDoubledItemsPriorities(list)).toBe(8153);
});

test('day03 sumBadgesPriorities function', () => {
  expect(sumBadgesPriorities(testList)).toBe(70);
  expect(sumBadgesPriorities(list)).toBe(2342);
});
