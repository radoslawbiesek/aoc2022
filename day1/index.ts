export function sumCalories(list: string[], numberOfElves: number): number {
  const sums = [0];
  list.forEach((el) => {
    if (el === "") {
      sums.push(0);
    } else {
      sums[sums.length - 1] += Number(el);
    }
  });

  const sorted = sums.sort((a, b) => b - a);
  const total = sorted
    .slice(0, numberOfElves)
    .reduce((sum, item) => sum + item, 0);

  return total;
}
