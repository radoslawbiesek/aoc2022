import { readInput } from '../utils';
import { findTotalSignalStrength, drawImage } from './index';

const testList = readInput('day10/data/test-input.txt');
const list = readInput('day10/data/input.txt');

test('day10 findTotalSignalStrength', () => {
  expect(findTotalSignalStrength(testList)).toBe(13140);
  expect(findTotalSignalStrength(list)).toBe(15140);
});

test('da010', () => {
  expect(drawImage(testList)).toMatchInlineSnapshot(`
"
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
"
`);
  expect(drawImage(list)).toMatchInlineSnapshot(`
"
###..###....##..##..####..##...##..###..
#..#.#..#....#.#..#....#.#..#.#..#.#..#.
###..#..#....#.#..#...#..#....#..#.#..#.
#..#.###.....#.####..#...#.##.####.###..
#..#.#....#..#.#..#.#....#..#.#..#.#....
###..#.....##..#..#.####..###.#..#.#....
"
`);
});
