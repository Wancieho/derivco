import express, { Request, Response, Router } from "express";

import { memoize } from "lodash";
import readline from "readline";

const fs = require("fs");

const router: Router = express.Router();

function isWinnable(stacks: number[]): boolean {
  // Check if the total number of coins is even.
  if (stacks.reduce((a, b) => a + b) % 2 !== 0) {
    return false;
  }

  // Initialize a memoization function to store results.
  const memoizedIsWinnable = memoize((stacks: number[]): boolean => {
    // Sort the stacks in descending order.
    stacks.sort((a, b) => b - a);

    // While there are at least two stacks with coins, continue playing.
    while (stacks.filter((stack) => stack > 0).length >= 2) {
      let stack1 = -1;
      let stack2 = -1;

      // Find the first non-empty stack for player A.
      for (let i = 0; i < stacks.length; i++) {
        if (stacks[i] > 0) {
          stack1 = i;
          break;
        }
      }

      // Find the first non-empty stack for player B (different from player A's stack).
      for (let i = stack1 + 1; i < stacks.length; i++) {
        if (stacks[i] > 0) {
          stack2 = i;
          break;
        }
      }

      if (stack1 === -1 || stack2 === -1) {
        // No valid move found, indicating the game cannot be won.
        return false;
      }

      // Remove a coin from both stacks.
      stacks[stack1]--;
      stacks[stack2]--;
    }

    // If all stacks are empty, the players have won the game.
    return stacks.every((stack) => stack === 0);
  });

  return memoizedIsWinnable(stacks);
}

function getWinningMoves(stacks: number[]): [number, number][] | null {
  // Check if the game is winnable.
  if (!isWinnable(stacks)) {
    return null;
  }

  // Initialize a queue to keep track of the next move.
  const queue: [number, number][] = [[0, 1]];

  // Initialize a list to store the winning moves.
  const winningMoves: [number, number][] = [];

  // While the queue is not empty, check if the current move is a winning move.
  while (queue.length > 0) {
    const [stack1, stack2] = queue.shift()!; // Use non-null assertion

    // If both stacks are empty, then the players have won the game.
    if (stacks[stack1] === 0 && stacks[stack2] === 0) {
      winningMoves.push([stack1, stack2]);
      break;
    }

    // Remove a coin from both stacks.
    stacks[stack1]--;
    stacks[stack2]--;

    // Add the next possible moves to the queue.
    for (let i = stack2 + 1; i < stacks.length; i++) {
      if (stacks[i] > 0) {
        queue.push([stack1, i]);
      }
    }
  }

  // Return the winning moves.
  return winningMoves;
}

router.get("/problemb", async (_: Request, res: Response) => {
  const fileStream = fs.createReadStream("./src/routes/problemb/inputs/1.in");

  const rl = readline.createInterface({
    input: fileStream,
  });

  let winningMoves;
  let output: string[] = [];

  const lines: any = [];
  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    winningMoves = getWinningMoves(
      lines[1].split(" ").map((line: any) => parseInt(line))
    );

    if (winningMoves !== null) {
      console.log("yes");
      for (const [stack1, stack2] of winningMoves) {
        // console.log(`${stack1 + 1} ${stack2 + 1}`);
        output.push(`${stack1 + 1} ${stack2 + 1}`);
      }
      console.log(output);
    } else {
      console.log("no");
    }

    res.send(
      `Problem A: Input = (${lines}) Output = (${winningMoves} ${output})`
    );
  });
});
export default router;
