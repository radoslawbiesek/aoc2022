import { readInput } from '../utils';
import { fromSNAFU, solution, toSNAFU } from './index';

const testInput = readInput('day25/data/test-input.txt');
const input = readInput('day25/data/input.txt');
describe('day25', () => {
  describe('convertion functions', () => {
    const testCases: [string, number][] = [
      ['12', 7],
      ['21', 11],
      ['111', 31],
      ['112', 32],
      ['122', 37],
      ['12111', 906],
      ['20012', 1257],
      ['1=-0-2', 1747],
      ['2=0=', 198],
      ['2=01', 201],
      ['1=-1=', 353],
      ['1-12', 107],
      ['1=', 3],
    ];
    test.each(testCases)('fromSNAFU converts %s to %s', (snafu, num) => {
      expect(fromSNAFU(snafu)).toBe(num);
    });
    test.each(testCases.map((t) => [t[1], t[0]] as [number, string]))(
      'toSNAFU converts %s to %s',
      (num, snafu) => {
        expect(toSNAFU(num)).toBe(snafu);
      }
    );
  });

  test('solution', () => {
    expect(solution(testInput)).toBe('2=-1=0');
    expect(solution(input)).toBe('2-2=12=1-=-1=000=222');
  });
});
