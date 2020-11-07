const { Client, Collection } = require("eris");
const { token } = require("../config.json");

const Command = require("./base/Command");

const client = new Client(token, {
  compress: true,
  intents: ["guilds", "guildMessages"],
  disableEvents: {
    CHANNEL_CREATE: true,
    CHANNEL_UPDATE: true,
    CHANNEL_DELETE: true,
    CHANNEL_OVERWRITE_CREATE: true,
    CHANNEL_OVERWRITE_UPDATE: true,
    CHANNEL_OVERWRITE_DELETE: true,
    MEMBER_KICK: true,
    MEMBER_PRUNE: true,
    MEMBER_BAN_ADD: true,
    MEMBER_BAN_REMOVE: true,
    MEMBER_UPDATE: true,
    MEMBER_ROLE_UPDATE: true,
    BOT_ADD: true,
    ROLE_CREATE: true,
    ROLE_UPDATE: true,
    ROLE_DELETE: true,
    INVITE_CREATE: true,
    INVITE_UPDATE: true,
    INVITE_DELETE: true,
    WEBHOOK_CREATE: true,
    WEBHOOK_UPDATE: true,
    WEBHOOK_DELETE: true,
    EMOJI_CREATE: true,
    EMOJI_UPDATE: true,
    EMOJI_DELETE: true,
    MESSAGE_DELETE_BULK: true,
    MESSAGE_PIN: true,
    MESSAGE_UNPIN: true,
    INTEGRATION_CREATE: true,
    INTEGRATION_UPDATE: true,
    INTEGRATION_DELETE: true,
  },
  messageLimit: 5,
  allowedMentions: {
    everyone: false,
  },
});

client.commands = new Collection(Command);

["commands", "events"].map((i) => require(`./handlers/${i}`)(client));

client.connect();
