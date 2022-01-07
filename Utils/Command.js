const Fs = require("fs");
const Discord = require("discord.js");
const Utils = require("./Utils");
const Config = require("../config.json");

module.exports = class {
  /**
   *
   * @param {string} name
   * @param {string[]} aliases
   * @param {string} filePath
   * @param {boolean} adminOnly
   * @param {boolean} devOnly
   */
  constructor(name, aliases, filePath, adminOnly = false, devOnly = false) {
    this.name = name;
    this.aliases = aliases;
    this.adminOnly = adminOnly;
    this.devOnly = devOnly;

    Fs.exists(filePath, (ex) => {
      if (!ex) throw new Error(`The file "${filePath}" doesn't exist!`);

      this.filePath = "." + filePath;
    });
  }

  Matches(alias) {
    return this.name == alias || this.aliases.some((a) => a == alias);
  }

  /**
   *
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  Run(client, message, args, db = null) {
    if (this.devOnly && message.author.id !== Config.devId) {
      Utils.SendEmbedError(
        `:sweat: ${message.member}**, эту команду может использовать только разработчик**`
      );
    } else if (
      this.adminOnly &&
      !message.member.hasPermission("ADMINISTRATOR")
    ) {
      Utils.SendEmbedError(
        `:sweat: ${message.member}**, эту команду может использовать только администратор**`
      );
    } else require(this.filePath).execute(client, message, args, db);
  }
};
