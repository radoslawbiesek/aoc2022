import { sumDoubledItemsPriorities, sumBadgesPriorities } from "./index";
import { loadList } from "../utils";

const testList = loadList("day3/data/test-input.txt");
const list = loadList("day3/data/input.txt");

test("day3 sumDoubledItemsPriorities function", () => {
  expect(sumDoubledItemsPriorities(testList)).toBe(157);
  expect(sumDoubledItemsPriorities(list)).toBe(8153);
});

test("day3 sumBadgesPriorities function", () => {
  expect(sumBadgesPriorities(testList)).toBe(70);
  expect(sumBadgesPriorities(list)).toBe(2342);
});
