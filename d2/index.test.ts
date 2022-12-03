import {
  calculateTotalPointsStrategy1,
  calculateTotalPointsStrategy2,
  loadRounds,
} from "./index";

test("day2 calculateTotalPointsStrategy1 function", () => {
  expect(calculateTotalPointsStrategy1(loadRounds("test-input.txt"))).toBe(15);
  expect(calculateTotalPointsStrategy1(loadRounds("input.txt"))).toBe(8890);
});

test("day2 calculateTotalPointsStrategy2 function", () => {
  expect(calculateTotalPointsStrategy2(loadRounds("test-input.txt"))).toBe(12);
  expect(calculateTotalPointsStrategy2(loadRounds("input.txt"))).toBe(10238);
});
