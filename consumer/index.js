import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Consumer server work!");
});

app.post("/webhook", (req, res) => {
  console.log("webhook received", req.body);
  res.status(200).send("webhook received");
});

app.listen(PORT, () => {
  console.log(`Consumer Server listening on port ${PORT}`);
});
