const Command = require("../base/Command");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      triggers: ["pong"],
      description: "Displays the clients latency",
    });
  }

  /**
   * @param {import("eris").Message} message
   */
  run(message) {
    const guild = this.client.guilds.get(message.guildID);
    const shard = this.client.shards.get(guild.shard.id);

    return message.channel.createMessage(
      `:ping_pong: Pong! **${shard.latency}ms**`
    );
  }
};
