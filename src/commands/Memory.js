const Command = require("../base/Command");

module.exports = class MemoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "memory",
      triggers: ["memoryusage"],
      description: "Monitors the memory usage",
    });
  }

  /**
   * @param {import("eris").Message} message
   */
  run(message) {
    return message.channel.createMessage(
      `I am using **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2
      )}mbs**`
    );
  }
};
