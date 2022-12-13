import { readInput } from '../utils';
import { countOrderedPackets, findDecoderKey } from './index';

const testList = readInput('day13/data/test-input.txt');
const list = readInput('day13/data/input.txt');

test('day13', () => {
  expect(countOrderedPackets(testList)).toBe(13);
  expect(countOrderedPackets(list)).toBe(5852);

  expect(findDecoderKey(testList)).toBe(140);
  expect(findDecoderKey(list)).toBe(24190);
});
