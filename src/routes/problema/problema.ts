import express, { Request, Response, Router } from "express";

import readline from "readline";

const fs = require("fs");

const router: Router = express.Router();

router.get("/problema", async (_: Request, res: Response) => {
  let input: string;
  let output: string;

  const fileStream = fs.createReadStream(
    "./src/routes/problema/inputs/sample03.in"
  );

  const calculateMostLikelyOutcomes = (d1: number, d2: number) => {
    const maxSum = d1 + d2;
    const sums = new Array(maxSum + 1).fill(0);

    for (let i = 1; i <= d1; i++) {
      for (let j = 1; j <= d2; j++) {
        sums[i + j]++;
      }
    }

    const maxFrequency = Math.max(...sums);
    const mostLikelyOutcomes: number[] = [];

    for (let i = 2; i <= maxSum; i++) {
      if (sums[i] === maxFrequency) {
        mostLikelyOutcomes.push(i);
      }
    }

    return mostLikelyOutcomes;
  };

  const rl = readline.createInterface({
    input: fileStream,
  });

  const lines: string[] = [];
  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    lines.forEach((line) => {
      const nums = line.split(" ");
      const a = parseInt(nums[0]);
      const b = parseInt(nums[1]);
      console.log(a);
      console.log(b);
      input = line;
      output = calculateMostLikelyOutcomes(a, b).join(" ");
      console.log(output);
    });

    res.send(`Problem A: Input = (${input}) Output = (${output})`);
  });
});
export default router;
