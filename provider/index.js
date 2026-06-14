import express from "express";
import runWebHook from "./event.js";
const app = express();
const port = 3100;

app.get("/", (req, res) => {
  res.send("Provider work!");
});

app.get("/webhook", (req, res) => {
  runWebHook("test");
  res.json("webhook provider work!");
});

app.listen(port, () => {
  console.log(`Provider server listening on port ${port}`);
});
