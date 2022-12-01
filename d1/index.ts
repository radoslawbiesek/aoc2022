import fs from "fs";
import path from "path";

const content = fs.readFileSync(path.join(__dirname, "input.txt"), {
  encoding: "utf8",
});
const list = content.split("\n");

const sums = [0];
let top3 = [0];

function updateTop3(newSum: number) {
  let inserted = false;
  top3.forEach((currentSum, index) => {
    if (newSum > currentSum && !inserted) {
      top3.splice(index, 0, newSum);
      top3 = top3.slice(0, 3);
      inserted = true;
    }
  });
}

list.forEach((el) => {
  const lastSum = Number(sums[sums.length - 1]);
  if (el === "") {
    updateTop3(lastSum);
    sums.push(0);
  } else {
    sums[sums.length - 1] = lastSum + Number(el);
  }
});

console.log("Max: ", top3[0]);
console.log("Top 3 total: ", top3[0] + top3[1] + top3[2]);
