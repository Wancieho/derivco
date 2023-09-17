import express, { Request, Response, Router } from "express";

import readline from "readline";

const fs = require("fs");

const router: Router = express.Router();

router.get("/problemb", async (_: Request, res: Response) => {
  let input: string;
  let output: string;

  const fileStream = fs.createReadStream("./src/routes/problemb/inputs/1.in");

  const moves = (n: number, stacks: number[]): string => {
    const totalCoins = stacks.reduce((acc, curr) => acc + curr, 0);
    const moves: string[] = [];
    let currentPlayer = "A";

    // Check if the total number of coins is even and there is at least one stack with an odd number of coins.
    if (totalCoins % 2 === 0 && stacks.some((stack) => stack % 2 !== 0)) {
      let oddStackIndex = -1;

      // Find the index of the first stack with an odd number of coins.
      for (let i = 0; i < n; i++) {
        if (stacks[i] % 2 !== 0) {
          oddStackIndex = i;
          break;
        }
      }

      while (stacks[oddStackIndex] > 0) {
        const otherPlayerIndex = (oddStackIndex + 1) % n;

        if (stacks[otherPlayerIndex] % 2 === 0) {
          stacks[oddStackIndex]--;
          stacks[otherPlayerIndex]--;
          moves.push(`${oddStackIndex + 1} ${otherPlayerIndex + 1}`);
        } else {
          stacks[otherPlayerIndex]--;
          stacks[otherPlayerIndex]--;
          moves.push(`${otherPlayerIndex + 1} ${otherPlayerIndex + 1}`);
        }

        currentPlayer = currentPlayer === "A" ? "B" : "A";
      }

      return `yes\n${moves.join("\n")}`;
    } else {
      return "no";
    }
  };

  const rl = readline.createInterface({
    input: fileStream,
  });

  const lines: string[] = [];
  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    console.log(
      moves(
        parseInt(lines[0]),
        lines[1].split(" ").map((line) => parseInt(line))
      )
    );

    res.send(`Problem A: Input = (${input}) Output = (${output})`);
  });
});
export default router;
