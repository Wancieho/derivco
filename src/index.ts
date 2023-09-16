import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import problema from "./routes/problema/problema";

dotenv.config();

const app = express();

app.use(cors());

app.use("/", problema);

app.listen(process.env.PORT, () => {
  console.info(`Server running on ${process.env.SERVER}:${process.env.PORT}`);
});
