type Shape = "rock" | "paper" | "scissors";
type OpponentEncryptedShape = "A" | "B" | "C";
type PlayerEncryptedHint = "X" | "Y" | "Z";
type Result = "win" | "draw" | "loss";

type Round = [OpponentEncryptedShape, PlayerEncryptedHint];

const shapeMap: Record<OpponentEncryptedShape | PlayerEncryptedHint, Shape> = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const shapeScoreMap: Record<Shape, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const resultScoreMap: Record<Result, number> = {
  win: 6,
  draw: 3,
  loss: 0,
};

const neededResultMap: Record<PlayerEncryptedHint, Result> = {
  X: "loss",
  Y: "draw",
  Z: "win",
};

const possibleRounds: [Shape, Shape, Result][] = [
  // player, opponent, result
  ["rock", "scissors", "win"],
  ["rock", "paper", "loss"],
  ["rock", "rock", "draw"],
  ["paper", "rock", "win"],
  ["paper", "paper", "draw"],
  ["paper", "scissors", "loss"],
  ["scissors", "paper", "win"],
  ["scissors", "scissors", "draw"],
  ["scissors", "rock", "loss"],
];

function calculateResult(round: Round): Result {
  const playerShape = shapeMap[round[1]];
  const opponentShape = shapeMap[round[0]];

  const result = possibleRounds.find(
    (r) => r[0] === playerShape && r[1] === opponentShape
  )![2];

  return result;
}

function calculateNeededShape(round: Round): Shape {
  const opponentShape = shapeMap[round[0]];
  const neededResult = neededResultMap[round[1]];

  if (neededResult === "draw") return opponentShape;

  const playerShape = possibleRounds.find(
    (r) => r[1] === opponentShape && r[2] === neededResult
  )![0];

  return playerShape;
}

function calculateRoundPoints(playerShape: Shape, result: Result): number {
  return resultScoreMap[result] + shapeScoreMap[playerShape];
}

function strategy1(round: Round): [Shape, Result] {
  const playerShape = shapeMap[round[1]];
  const result = calculateResult(round);

  return [playerShape, result];
}

function strategy2(round: Round): [Shape, Result] {
  const playerShape = calculateNeededShape(round);
  const result = neededResultMap[round[1]];

  return [playerShape, result];
}

function calculateTotalPoints(strategy: (round: Round) => [Shape, Result]) {
  return function (list: string[]): number {
    const rounds = list.map((item) => item.split(" ")) as Round[];
    const total = rounds.reduce(
      (sum, round) => sum + calculateRoundPoints(...strategy(round)),
      0
    );

    return total;
  };
}

export const calculateTotalPointsStrategy1 = calculateTotalPoints(strategy1);
export const calculateTotalPointsStrategy2 = calculateTotalPoints(strategy2);
