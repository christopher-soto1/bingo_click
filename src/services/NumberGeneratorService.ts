import { GameConfig } from "../types/GameConfig";

export function generateNumber(
  config: GameConfig,
  history: string[]
): number {

  if (config.allowRepeats) {
    return Math.floor(Math.random() * config.maxNumber) + 1;
  }

  const availableNumbers: number[] = [];

  for (let i = 1; i <= config.maxNumber; i++) {

    if (!history.includes(i.toString().padStart(2, "0"))) {
      availableNumbers.push(i);
    }

  }

  if (availableNumbers.length === 0) {
    return -1;
  }

  const randomIndex = Math.floor(
    Math.random() * availableNumbers.length
  );

  return availableNumbers[randomIndex];
}