const Discord = require("discord.js");
const Colors = require("cli-color");
const Config = require("../config.json");
const SQLite = require('better-sqlite3');

module.exports = class {
  /**
   * Removes all channels from a discord server
   *
   * @param {Discord.Guild} guild Discord server
   */
  static async RemoveAllChannels(guild) {
    console.log(Colors.yellowBright("Starting clearing channels. . ."));
    try {
      if (guild && guild.available) {
        let botAsMember = guild.members.cache.get(client.user.id);
        if (botAsMember.hasPermission("MANAGE_CHANNELS")) {
          let channelsCount = guild.channels.cache.size;

          await guild.channels.cache.forEach((channel) => {
            channel.delete("Utils.RemoveAllChannels method");
          });

          console.log(
            Colors.yellowBright(
              `Removed ${channelsCount} channels from the guild: ${guild.name}`
            )
          );
        } else
          throw new Error(
            "The client doesn't have MANAGE_CHANNELS permission in this guild!"
          );
      } else throw new Error("The guild is unavailable!");
    } catch (c) {
      console.log(Colors.redBright(c));
    }
  }

  /**
   * Clears all roles and nicknames of the community
   *
   * @param {Discord.Guild} guild
   */
  static async ClearRolesAndNicknames(guild) {
    guild.members.cache.forEach((m) => {
      m.roles.cache.forEach((r) => {
        if (r.id != guild.id && !m.hasPermission("KICK_MEMBERS")) {
          m.roles.remove(r);
          m.setNickname("");
        }
      });
    });
  }

  /**
   * Sends an error to the discord server text channel
   *
   * @param {Discord.TextChannel} channel Text channel for the message
   */
  static async SendEmbedError(channel, message) {
    let embedMessage = new Discord.MessageEmbed()
      .setDescription(message)
      .setColor(Config.colors.red);

    channel
      .send(embedMessage)
      .then((msg) => msg.delete({ timeout: 6000 }))
      .catch(console.error);
  }

  /**
   * Checks if the text channel is a channel for bot commands
   *
   * @param {Discord.TextChannel} channel the channel to check
   */
  static IsCommandChannel(channel) {
    return channel.id == Config.channels.commands;
  }

  /**
   *  Builds an embed discord message to show
   *  information about tesla-craft player
   * @param {Object} lookup
   */
  static BuildLookupEmbedMessage(lookup) {
    let status = lookup.status
      ? ":green_circle: Онлайн"
      : ":red_circle Офлайн:";

    let history = "";
    lookup.history.forEach((item) => (history += item + "\n"));

    let message = new Discord.MessageEmbed()
      .setTitle(
        "Информация об игроке " +
        lookup.username
          .replace("_", "\\_")
          .replace("~", "\\~")
          .replace("*", "\\*")
      )
      .setColor(Config.colors.purple)
      .setFooter("Tesla-Cat bot by _GromoBoy_")
      .addField("Звание", lookup.rank, true)
      .addField("Статус", status, true)
      .addField("Забанен", lookup.bannedStatus, true)
      .addField("Имеет мут", lookup.muteStatus, true)
      .addField("Первый вход на сервер", lookup.firstEntry, true)
      .addField("Последний вход на сервер", lookup.lastEntry, true)
      .addField("История наказаний", history, true);

    if (lookup.status)
      message.setDescription(":beginner: **Местоположение: **" + lookup.place);

    return message;
  }

  /**
   * 
   * @param {string} name 
   * @param {SQLite.Database} db
   */
  static GetTeamByName(name, db) {
    let query = db.prepare("SELECT * FROM TournamentTeams WHERE Name = ?");
    let result = query.get(name);

    return result;
  }
};
