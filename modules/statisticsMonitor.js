const Discord = require("discord.js");
const Colors = require("cli-color");
const Config = require("../config.json");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Guild} guild
 */
module.exports = async function (client, guild) {
  console.log(
    Colors.yellowBright("Server statistics monitoring module is working.")
  );

  client.setInterval(async () => {
    await guild.channels.cache
      .get(Config.statistics.totalMembers)
      .setName("Всего участников: " + guild.memberCount);

    await guild.channels.cache
      .get(Config.statistics.totalVerifiedMembers)
      .setName(
        "Авторизированных: " +
        guild.members.cache.filter(
          (m) => m.roles.cache.size > 1 && !m.user.bot
        ).size
      );

    await guild.channels.cache
      .get(Config.statistics.onlineMembers)
      .setName(
        "Онлайн: " +
        guild.members.cache.filter(
          (m) => m.presence.status != "offline" && !m.user.bot
        ).size
      );

    let voiceOnlineMembers = guild.members.cache.filter(
      (m) => m.voice.channel != undefined && !m.user.bot
    ).size;

    await guild.channels.cache
      .get(Config.statistics.voiceOnlineMembers)
      .setName("В голосовых каналах: " + voiceOnlineMembers);
  }, 8 * 60 * 1000);
};
