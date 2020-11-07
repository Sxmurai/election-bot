const Event = require("../base/Event");
const { prefix } = require("../../config.json");

module.exports = class MessageEvent extends Event {
  constructor(client) {
    super(client, {
      event: "messageCreate",
    });
  }

  /**
   * @param {import("eris").Message} message
   */
  run(message) {
    if (
      message.author.bot ||
      !message.content.toLowerCase().startsWith(prefix.toLowerCase())
    )
      return;

    const [cmd, ...args] = message.content
      .toLowerCase()
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    if (!cmd) return;

    const command = this.client.commands.find(
      (c) => c.options.name === cmd || (c.options.triggers ?? []).includes(cmd)
    );

    if (!command) return;

    try {
      command.run(message, args);

      console.log(
        `${message.author.username}#${message.author.discriminator} (${message.author.id}) ran the ${command.options.name} command.`
      );
    } catch (error) {
      console.error(error);

      message.channel.createMessage(
        `We ran into an error!\n\`\`\`js\n${error.toString()}\`\`\``
      );
    }
  }
};
