const Command = require("../base/Command");
const fetch = require("node-fetch");

module.exports = class ElectionCommand extends Command {
  constructor(client) {
    super(client, {
      name: "election",
      triggers: "electiondata",
      description: "Displays the election data",
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

    const result = {
      trump: { won: [], votes: 0 },
      biden: { won: [], votes: 0 },
    };

    for (const res of data) {
      const { rating, stateCode, electoralVotes } = res;

      switch (rating) {
        case "Dem Win":
          result.biden.votes += electoralVotes;
          result.biden.won.push(stateCode);
          break;

        case "Rep Win":
          result.trump.votes += electoralVotes;
          result.trump.won.push(stateCode);
          break;
      }
    }

    return message.channel.createMessage(
      this.createProlog(
        Object.entries(result).map(([key, val]) => ({
          name: key.replace(/(\b\w)/gi, (str) => str.toUpperCase()),
          value: [
            `Votes: ${val.votes}`,
            `States Won: ${val.won.join(", ")}`,
            `Won: ${val.votes >= 270 ? "Yes" : "No"}`,
          ],
        }))
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
