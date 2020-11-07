const Event = require("../base/Event");

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, {
      event: "ready",
    });
  }

  run() {
    console.log(`${this.client.user.username} is ready!`);
  }
};
