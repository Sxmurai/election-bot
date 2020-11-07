const { readdirSync } = require("fs");
const { join } = require("path");

const fileDirectory = join(__dirname, "..", "events");

module.exports = (client) => {
  for (const file of readdirSync(fileDirectory).filter((file) =>
    file.endsWith(".js")
  )) {
    const event = new (require(join(fileDirectory, file)))(client);

    client.on(event.options.event, event.run.bind(event));
  }
};
