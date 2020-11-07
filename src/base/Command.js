module.exports = class Command {
  constructor(client, options = {}) {
    this.options = options;
    this.client = client;
  }
};
