const Command = require("../base/Command");
const fetch = require("node-fetch");

module.exports = class RepublicanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "republican",
      triggers: ["rep", "trump"],
      description:
        "Displays the election votes specifically for Trump (Republican)",
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

    const biden = data.filter((k) => k.rating === "Rep Win");

    const result = { votes: 0, states: [] };

    for (const res of biden) {
      const { stateCode, electoralVotes } = res;

      result.votes += electoralVotes;
      result.states.push(stateCode);
    }

    return message.channel.createMessage(
      this.createProlog([
        {
          name: "Trump",
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
