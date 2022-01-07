let Mineflayer = require("mineflayer");
let AutoAuth = require("mineflayer-auto-auth");
const Discord = require("discord.js");
const Config = require("../config.json");
const Colors = require("cli-color");
const LookupParser = require("../Utils/LookupParser");
const SQLite = require("better-sqlite3");
const Utils = require("../Utils/Utils");

let lookupParser = new LookupParser();
let lookupQuery = new Discord.Collection();
let lastCommand = null;
let lookupResult = null;

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Guild} guild
 * @param {Map} authData
 * @param {SQLite.Database} database
 */
module.exports = async function (client, guild, authData, database) {
  console.log(Colors.yellowBright("Teslacraft monitoring module is working."));

  let bot = Mineflayer.createBot({
    username: "TeslaCat",
    host: "PLAY.TESLACRAFT.ORG",
    port: 25565,
    plugins: [AutoAuth],
    AutoAuth: Config.privates.teslaCatBotPass,
    version: "1.12.2",
  });

  bot.settings.viewDistance = "tiny";

  bot.on("login", () => {
    console.log("TeslaCraft bot is logged!");
  });

  bot.on("message", async (jsonMsg) => {
    if (lastCommand == "lookup") {
      lookupParser.Read(jsonMsg);
    }
  });

  bot.on("chat", async (username, message, translate, jsonMsg, matches) => {
    let args = message.trim().split(/\s/g);

    if (IsPrivateMessage(message)) {
      args.shift();

      if (args[0] === "link") {
        args.shift();
        let userTag = args.join(" ");
        let member = guild.members.cache.find((m) => m.user.tag == userTag);

        if (!member) {
          bot.whisper(
            username,
            `${userTag} не является участником Discord-сервера ${guild.name}. Чтобы вступить, перейдите по этой ссылке: *ссылка*`
          );
        } else if (IsAlreadyMember(member, database)) {
          bot.whisper(
            username,
            `${userTag} уже является участником Discord-сервера ${guild.name}.`
          );
        } else {
          let code = GenerateCode();
          bot.whisper(
            username,
            "Для подтверждения отправьте боту Tesla Cat нашего Discord-сервера следующий код: " +
              code
          );

          authData.set(member.user.id, { nickname: username, code: code });
        }
      }
    }
  });

  bot.on("error", (err) => console.log(err));

  lookupParser.on("end", async (lookup) => {
    lastCommand = null;
    let memberData = lookupQuery.get(lookup.username);
    memberData.message.edit("_");
    memberData.message.edit(Utils.BuildLookupEmbedMessage(lookup));

    let member = guild.members.cache.get(memberData.memberId);

    await member.roles.add(
      guild.roles.cache.find((role) => role.name == lookup.rank)
    );

    if (lookup.rank != "Рядовой")
      await member.roles.add(guild.roles.cache.get(Config.roles.donator));

    member.setNickname(
      lookup.username
        .replace("a", "а")
        .replace("A", "А")
        .replace("o", "о")
        .replace("O", "О")
        .replace("e", "е")
        .replace("E", "Е")
    );

    let stmt = database.prepare(
      "INSERT INTO Users(ID, Nickname, RankID) VALUES (@id, @nickname, (SELECT ID FROM Ranks WHERE Name = @rank))"
    );

    stmt.run({
      id: memberData.memberId,
      nickname: lookup.username,
      rank: lookup.rank,
    });
    lookupQuery.delete(lookup.username);
  });

  client.on("message", async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type !== "dm") return;
    if (msg.content.length !== 4) return;

    let userData = authData.get(msg.author.id);

    if (!userData) return;

    if (msg.content === userData.code) {
      msg.channel.send(
        ":white_check_mark: Вы успешно авторизировались на сервер **" +
          guild.name +
          "**!"
      );

      msg.channel
        .send(":detective: **Получение информации о вас. . .**")
        .then((m) => {
          lastCommand = "lookup";
          bot.chat("/lookup " + userData.nickname);
          lookupQuery.set(userData.nickname, {
            message: m,
            memberId: msg.author.id,
          });
        })
        .catch(console.log);

      authData.delete(msg.author.id);
    }
  });
};

/**
 *
 * @param {string} message
 * @returns {boolean}
 */
function IsPrivateMessage(message) {
  return message.startsWith("Мне]");
}

/**
 *
 * @param {Discord.GuildMember} member
 * @param {SQLite.Database} database
 * @returns {boolean}
 */
function IsAlreadyMember(member, database) {
  let stmt = database.prepare("SELECT * FROM Users WHERE ID = @id");
  return stmt.get({ id: member.id }) != undefined;
}

function GenerateCode() {
  let code = "";
  for (let i = 0; i < 4; i++) code += Math.round(Math.random() * 9);
  return code;
}
