module.exports = class Event {
  constructor(client, options = {}) {
    this.options = options;
    this.client = client;
  }
};
