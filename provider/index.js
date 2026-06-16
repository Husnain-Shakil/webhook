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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendWithRetry = async (url, payload, retries = 1, baseDelayMs = 1000) => {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt} to send webhook to ${url}...`);

      const response = await axios.post(url, payload);

      console.log(
        `Successfully triggered webhook at ${url}: ${response.status}`,
      );
      return true;
    } catch (err) {
      const status = err.response?.status;
      const msg = status ? `HTTP ${status}` : err.message;

      console.error(`Attempt ${attempt} failed for ${url}: ${msg}`);

      if (attempt > retries) {
        console.error(`No more retries left for ${url}. Giving up.`);
        return false;
      }

      const delay = baseDelayMs * attempt;
      console.log(`Retrying webhook at ${url} in ${delay}ms...`);
      await sleep(delay);
    }
  }

  return false;
};

app.post("/trigger-webhook", (req, res) => {
  const { event, payload } = req.body;
  webhookData.forEach((webhook) => {
    if (webhook.events.includes(event)) {
      sendWithRetry(webhook.url, payload, 3, 500);
      // console.log(
      //   `Triggering webhook at ${webhook.url} with payload:`,
      //   payload,
      // );
      // axios.post(webhook.url, payload).catch((err) => {
      //   console.error(
      //     `Error triggering webhook at ${webhook.url}:`,
      //     err.message,
      //   );
      // });
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
