const Command = require("../base/Command");
const fetch = require("node-fetch");

module.exports = class DemocraticCommand extends Command {
  constructor(client) {
    super(client, {
      name: "democratic",
      triggers: ["demo", "biden"],
      description:
        "Displays the election votes specifically for Biden (Demcratic)",
    });
  }

  /**
   * @param {import("eris").Message} message
   */
  async run(message) {
    const data = await (
      await fetch(
        `https://api-election.cbsnews.com/api/public/races2/2020/G?Filter.officeCode=P`
      )
    ).json();

    const biden = data.filter((k) => k.rating === "Dem Win");

    const result = { votes: 0, states: [] };

    for (const res of biden) {
      const { stateCode, electoralVotes } = res;

      result.votes += electoralVotes;
      result.states.push(stateCode);
    }

    return message.channel.createMessage(
      this.createProlog([
        {
          name: "Biden",
          value: [
            `Votes: ${result.votes}`,
            `States: ${result.states.join(", ")}`,
            `Won: ${result.votes >= 270 ? "Yes" : "No"}`,
          ],
        },
      ])
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

    let str = "```\n";

    if (heading) str += `${heading}\n\n`;

    for (const line of lines) {
      if (line.name.length && line.value.length)
        str += `${line.name.padStart(padding(), " ")}:\n${line.value
          .map((val) => `\u3000 ${val}`)
          .join("\n")}\n\n`;
    }

    return (str += "```");
  }
};
