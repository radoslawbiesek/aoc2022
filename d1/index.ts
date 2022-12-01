import fs from "fs";
import path from "path";

export function loadList(filename: string): string[] {
  const content = fs.readFileSync(path.join(__dirname, filename), {
    encoding: "utf8",
  });
  const list = content.split("\n");

  return list;
}

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

console.log("Top 1: ", sumCalories(loadList("input.txt"), 1));
console.log("Top 3: ", sumCalories(loadList("input.txt"), 3));
