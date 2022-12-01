import { loadList, sumCalories } from "./index";

test("day1 sumCalories function", () => {
  expect(sumCalories(loadList("test-input.txt"), 1)).toBe(24000);
  expect(sumCalories(loadList("test-input.txt"), 3)).toBe(45000);
});
