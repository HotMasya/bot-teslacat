const Discord = require("discord.js");
const Colors = require("cli-color");
const Utils = require("../../Utils/Utils");
const Config = require("../../config.json");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.execute = async function (client, message, args) {
  let member = message.member;
  let channel = member.voice.channel;

  if (
    channel &&
    channel.parent.id == Config.channels.privatesCategory &&
    !channel.permissionsFor(member).has("MANAGE_CHANNELS")
  )
    return Utils.SendEmbedError(
      message.channel,
      `:unicorn: ${member}**, в данный момент вы не находитесь в личном голосовом канале**`
    );

  let target =
    message.mentions.members.size != 0
      ? message.mentions.members.first()
      : message.guild.members.cache.get(args.shift());

  if (message.mentions.members.size != 0) args.shift();

  if (!target)
    return Utils.SendEmbedError(
      message.channel,
      `:unicorn: ${member}**, такого участника нету на нашем сервере.\n\n\`\`\`Чтобы указать участника, используйте @упоминание или его ID\`\`\`**`
    );

  if (target.id == message.author.id)
    return Utils.SendEmbedError(
      message.channel,
      `:unicorn: ${member}**, вы не можете кикнуть самого себя**`
    );

  if (args.length == 0)
    return Utils.SendEmbedError(
      message.channel,
      `:unicorn: ${member}**, вы не указали причину кика**`
    );

  if (target.voice.channel) {
    target.voice.kick();
  }

  channel.overwritePermissions([
    {
      id: target.user.id,
      deny: ["CONNECT"],
    },
  ]);

  let embed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setColor(Config.colors.orange)
    .setDescription(
      "Участник был удалён из голосового канала\n" +
        "--------------------------------------------" +
        "\n**Участник:** " +
        target.nickname +
        "\n**Канал:** " +
        member.voice.channel.name +
        "\n**Причина:** " +
        args.join(" ")
    )
    .setFooter(`Кикнул: ${member.nickname}`, member.user.avatarURL());
  message.channel.send(embed);
};
