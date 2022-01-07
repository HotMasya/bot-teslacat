const Discord = require("discord.js");
const Colors = require("cli-color");
const Config = require("../config.json");
const Url = require("valid-url");

const minTime = 180 * 1000;
const minCharsDifference = 5;
let users = new Discord.Collection();
let allowedServices = [
  "spotify.com",
  "soundcloud.com",
  "teslacraft.org",
  "vk.com",
];

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Guild} guild
 */
module.exports = async function (bot, guild) {
  bot.on("message", (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(Config.prefix)) return;
    // if(message.author.id == Config.devId) return;

    CheckFlood(message);
  });
};

/**
 *
 * @param {Discord.Message} message
 */
async function CheckFlood(message) {
  if (!users.get(message.author.id)) {
    users.set(message.author.id, {
      lastMessage: message.content.toLowerCase(),
      timestamp: message.createdTimestamp,
      cases: 1,
    });
  } else {
    let target = users.get(message.author.id);

    if (
      (target.lastMessage.indexOf(message.content.toLowerCase()) >= 0 ||
        message.content.toLowerCase().indexOf(target.lastMessage) >= 0) &&
      Math.abs(message.content.length - target.lastMessage.length) <=
        minCharsDifference &&
      new Date().getTime() - target.timestamp < minTime
    ) {
      target.cases++;
      if (!message.deleted) message.delete();
    } else if (new Date().getTime() - target.timestamp >= minTime) {
      target.lastMessage = message.content;
      target.cases = 0;
    }

    if (target.cases == 3) {
      //  Дать предупреждение
      message.channel.send(
        `:face_with_raised_eyebrow: ${message.member}**, вы отправили 3 похожих сообщения подряд и получите по жопе!**`
      );
    }

    console.log(users.get(message.author.id));
  }
}

/**
 *
 * @param {Discord.Message} message
 */
async function CheckAds(message) {
  let contents = message.content.toLowerCase().trim().split(/\s/g);

  let hasBannedUri = IncludesBannedService(contents);

  if (hasBannedUri) {
    users.get(message.author.id).cases++;
  }
}

/**
 *
 * @param {string} url
 * @returns {boolean}
 */
function IsAllowedService(url) {
  let result = false;
  allowedServices.forEach((service) => {
    if (url.includes(service)) {
      result = true;
      return;
    }
  });

  return result;
}

/**
 *
 * @param {string[]} contents
 * @returns {boolean}
 */
function IncludesBannedService(contents) {
  let hasBannedUri = false;

  contents.forEach((word) => {
    if (Url.isUri(word) && !IsAllowedService(word)) {
      hasBannedUri = true;
      return;
    }
  });

  return hasBannedUri;
}
