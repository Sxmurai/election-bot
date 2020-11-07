const Command = require("../base/Command");
const { prefix } = require("../../config.json");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      triggers: ["commands", "cmds", "halp", "h"],
      description: "Displays information on a command or all commands",
      usage: "<command>",
    });
  }

  /**
   * @param {import("eris").Message} message
   */
  run(message, args) {
    const command = this.client.commands.find(
      (c) =>
        c.options.name === (args[0] ?? "") ||
        (c.options.triggers ?? []).includes(args[0] ?? "")
    );

    if (!args.length || !command) {
      const commands = this.client.commands;

      return message.channel.createMessage(
        this.createProlog(
          commands.map((cmd) => ({
            name: `${prefix}${cmd.options.name}`,
            value: cmd.options.description ?? "No description",
          })),
          `Here are all of the commands for ${this.client.user.username},`
        )
      );
    }

    return message.channel.createMessage(
      this.createProlog(
        Object.entries(command.options).map(([name, value]) => ({
          name: name.replace(/(\b\w)/gi, (str) => str.toUpperCase()),
          value: Array.isArray(value) ? value.join(", ") : value,
        })),
        `Help for ${command.options.name},`
      )
    );
  }

  createProlog(lines, heading) {
    const padding = () => {
      let padding = 0;

      for (const line of lines) {
        if (line.name.length > padding) padding = line.name.length;
      }

      return padding;
    };

    let str = "```prolog\n";

    if (heading) str += `${heading}\n\n`;

    for (const line of lines) {
      if (line.name.length && line.value.length)
        str += `${line.name.padStart(padding(), " ")} :: ${line.value}\n`;
    }

    return (str += "```");
  }
};
