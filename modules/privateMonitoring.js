const Discord = require("discord.js");
const Colors = require("cli-color");
const Config = require("../config.json");

/**
 *
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 * @param {Discord.Guild} guild
 * @param {Discord.Client} client
 * @param {Discord.Collection} channels
 */
async function MonitorPrivates(oldState, newState, guild, client, channels) {
  let category = guild.channels.cache.get(Config.channels.privatesCategory);

  if (
    newState.channel &&
    newState.channel.id == Config.channels.createPrivateChannel &&
    !channels.has()
  ) {
    guild.channels
      .create(newState.member.nickname + "'s channel", {
        type: "voice",
        parent: category,
        userLimit: 2,
        permissionOverwrites: [
          {
            id: newState.member,
            allow: ["MANAGE_CHANNELS"],
          },
        ],
      })
      .then((vc) => {
        if (newState.member.voice) {
          newState.member.voice.setChannel(vc);
          channels.set(newState.member.id, {
            ownerId: vc.id
          });
        } else vc.delete();
      })
      .catch(console.error);
  }
  else if (
    oldState.channel &&
    oldState.channel.parent.id == category.id &&
    oldState.channel.id != Config.channels.createPrivateChannel &&
    oldState.channel.members.size == 0
  ) {
    oldState.channel.delete();
    channels.delete(oldState.channel.id);
  }
  else newState.member.voice.setChannel(newState.channel);
}

/**
 * main private voice channel logics
 *
 * @param {Discord.Client} client Client as event listener
 * @param {Discord.Guild} guild Guild
 * @param {Discord.Collection} channels Private channels collection
 */
module.exports = async function (client, guild, channels) {
  console.log(
    Colors.yellowBright("Private channels monitoring module is working.")
  );
  client.on("voiceStateUpdate", (oldState, newState) =>
    MonitorPrivates(oldState, newState, guild, client, channels)
  );

  client.on("channelDelete", channel => {
    if (channels.get(channel.id))
      channels.delete(channel.id);
  });
};
