import events from "events";
const eventEmitter = new events.EventEmitter();

const webhookEventHandler = (payload) => {
  console.log("I hear a webhook!", payload);
};

eventEmitter.on("event", webhookEventHandler);

eventEmitter.emit("webhook");

const runWebHook = (payload) => {
  eventEmitter.emit("webhook", payload);
};

export default runWebHook;
