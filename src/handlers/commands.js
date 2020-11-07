const { readdirSync } = require("fs");
const { join } = require("path");

const fileDirectory = join(__dirname, "..", "commands");

module.exports = (client) => {
  for (const file of readdirSync(fileDirectory).filter((file) =>
    file.endsWith(".js")
  )) {
    const command = new (require(join(fileDirectory, file)))(client);

    client.commands.set(command.options.name, command);
  }
};
