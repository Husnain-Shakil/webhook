import axios from "axios";
import express from "express";

const app = express();
const PORT = 3100;

app.use(express.json());

const webhookData = []; // { url: string, events: string[] }[]

app.get("/", (req, res) => {
  res.send("Provider work!");
});

app.post("/register-webhook", (req, res) => {
  const { url, events } = req.body;
  webhookData.push({ url, events });
  console.log("Registered webhook with data:", req.body);
  res.status(200).send("webhook registered");
});

app.post("/trigger-webhook", (req, res) => {
  const { event, payload } = req.body;
  webhookData.forEach((webhook) => {
    if (webhook.events.includes(event)) {
      console.log(
        `Triggering webhook at ${webhook.url} with payload:`,
        payload,
      );
      axios.post(webhook.url, payload).catch((err) => {
        console.error(
          `Error triggering webhook at ${webhook.url}:`,
          err.message,
        );
      });
    }
  });

  res.status(200).send("Webhooks triggered!");
});

app.get("/webhook", (req, res) => {
  res.json("webhook provider work!");
});

app.listen(PORT, () => {
  console.log(`Provider server listening on port ${PORT}`);
});
