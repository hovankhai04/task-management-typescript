import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./configs/database";
import Task from "./models/task.model";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false
  })
  res.json(tasks);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
