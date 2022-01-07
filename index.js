const Discord = require("discord.js");
const Colors = require("cli-color");

const Utils = require("./Utils/Utils");
const Config = require("./config.json");
const Command = require("./Utils/Command");

const PrivateMonitoring = require("./modules/privateMonitoring");
const StatisticsMonitor = require("./modules/statisticsMonitor");
const TeslacraftMonitor = require("./modules/teslacraftMonitor");
const ChatMonitor = require("./modules/chatMonitor");
const SQLite = require("better-sqlite3");

const Channels = new Discord.Collection();

const Bot = new Discord.Client();
let commands = new Map();
let authData = new Map();
const database = new SQLite("discord.db");

function OnClientReady() {
  let guild = Bot.guilds.cache.get(Config.mainServerId);

  //  Private voice channels
  commands.set(
    "vkick",
    new Command("vkick", ["vk"], "./commands/privateVC/vkick.js")
  );
  commands.set(
    "vunkick",
    new Command("vunkick", ["vuk"], "./commands/privateVC/vunkick.js")
  );

  //  Information
  commands.set(
    "rules",
    new Command("rules", [], "./commands/information/rules.js", true)
  );
  commands.set(
    "welcome",
    new Command("welcome", [], "./commands/information/welcome.js", true)
  );
  commands.set(
    "updaterules",
    new Command("updaterules", ["ur"], "./commands/information/updaterules.js")
  );

  commands.set(
    "makeEmbed",
    new Command("makeembed", ["embed"], "./commands/information/makeembed.js")
  );

  //   //  Leveling
  //   Bot.commands.set(
  //     new Command("level", ["lvl"], "./commands/leveling/level.js")
  //   );
  //   Bot.commands.set(new Command("top", [], "./commands/leveling/top.js"));
  //   Bot.commands.set(
  //     new Command(
  //       "setlevel",
  //       ["setlvl", "slvl"],
  //       "./commands/leveling/setlevel.js"
  //     )
  //   );
  //   Bot.commands.set(
  //     new Command("givexp", ["gxp"], "./commands/leveling/givexp.js")
  //   );

  //    Testing
  commands.set(
    "ping",
    new Command("ping", [], "./commands/testing/ping.js", false, true)
  );

  PrivateMonitoring(Bot, guild, Channels);
  //StatisticsMonitor(Bot, guild);
  //TeslacraftMonitor(Bot, guild, authData, database);
  //ChatMonitor(Bot, guild);

  //InitDatabaseTables();

  console.log(Colors.yellowBright(`${commands.size} commands loaded!`));
  console.log(Colors.greenBright("Bot is ready!"));
}

/**
 *
 * @param {Discord.Guild} guild
 */
function InitRanksTable(guild) {
  let stmt = database.prepare(
    "INSERT INTO Ranks(ID, Name) VALUES (@id, @name)"
  );

  let availableRanks = [
    "Рядовой",
    "Ефрейтор",
    "Мл. Сержант",
    "Сержант",
    "Ст. Сержант",
    "Прапорщик",
    "Ст. Прапорщик",
    "Лейтенант",
    "Ст. Лейтенант",
    "Капитан",
    "Майор",
    "Подполковник",
    "Полковник",
    "Генерал",
    "Маршал",
    "Император",
  ];

  availableRanks.forEach((rank) => {
    let id = guild.roles.cache.find((role) => role.name == rank).id;
    console.log(stmt.run({ id: id, name: rank }));
  });
}

function InitDatabaseTables() {
  let ranks = database.prepare(
    "CREATE TABLE IF NOT EXISTS Ranks (" +
    "ID TEXT NOT NULL PRIMARY KEY," +
    "Name TEXT NOT NULL)"
  );

  let users = database.prepare(
    "CREATE TABLE IF NOT EXISTS Users (" +
    "ID TEXT NOT NULL PRIMARY KEY," +
    "Nickname TEXT NOT NULL," +
    "RankID TEXT NOT NULL," +
    "FOREIGN KEY(RankID) REFERENCES Ranks(ID))"
  );

  let punishTypes = database.prepare(
    "CREATE TABLE IF NOT EXISTS PunishTypes (" +
    "ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
    "Name TEXT NOT NULL)"
  );

  let banlist = database.prepare(
    "CREATE TABLE IF NOT EXISTS Banlist (" +
    "ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
    "UserID TEXT NOT NULL," +
    "PunishTypeID INT NOT NULL," +
    "FOREIGN KEY(PunishTypeID) REFERENCES PunishTypes(ID)," +
    "FOREIGN KEY(UserID) REFERENCES Users(ID))"
  );

  let tourTeams = database.prepare(
    `
    CREATE TABLE IF NOT EXISTS TournamentTeams (
      ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL
      )
    `
  );

  let teamsMembers = database.prepare(
    `
      CREATE TABLE IF NOT EXISTS TournamentMembers(
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        MinecraftUsername TEXT NOT NULL,
        DiscordId TEXT NOT NULL,
        TeamId INTEGER NOT NULL,
        FOREIGN KEY(TeamId) REFERENCES TournamentTeams(ID) ON DELETE CASCADE
      )
    `
  )

  ranks.run();
  users.run();
  punishTypes.run();
  banlist.run();

  tourTeams.run();
  teamsMembers.run();
}

async function start() {
  let guild = Bot.guilds.cache.get(Config.mainServerId);

  Bot.on("ready", () => {
    OnClientReady();
  });

  Bot.on("voiceStateUpdate", async (oldState, newState) => {
    let guild = Bot.guilds.cache.get(Config.mainServerId);
    let inVoiceRole = guild.roles.cache.get(Config.roles.inVoice);
    if (
      oldState.channel &&
      !newState.channel &&
      oldState.member.roles.cache.has(Config.roles.inVoice)
    ) {
      oldState.member.roles.remove(inVoiceRole);
    } else if (
      newState.channel &&
      !oldState.channel &&
      !newState.member.roles.cache.has(Config.roles.inVoice)
    ) {
      newState.member.roles.add(inVoiceRole);
    }
  });

  Bot.on("guildMemberAdd", (member) => {
    let stmt = database.prepare(
      "SELECT Nickname, RankID FROM Users WHERE ID = @id"
    );

    let memberData = stmt.get({ id: member.id });
    if (!memberData) return;

    member.setNickname(memberdata.Nickname);
    member.roles.add(guild.roles.cache.get(memberData.RankID));
  });

  Bot.on("message", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(Config.prefix)) return;
    if (
      !Utils.IsCommandChannel(message.channel) &&
      message.author.id !== Config.devId
    ) {
      message.delete();
      Utils.SendEmbedError(
        message.channel,
        `:face_with_raised_eyebrow: ${message.member}**, здесь нельзя использовать эту команду**`
      );
      return;
    }

    let args = message.content.trim().slice(Config.prefix.length).split(/\s/g);
    let command = args.shift().toLowerCase();

    commands.forEach((cmd) => {
      if (cmd.Matches(command)) {
        cmd.Run(Bot, message, args, db, Channels);
        return;
      }
    });

    if (!message.deleted) message.delete();
  });

  Bot.login(Config.privates.discordBotToken);
}

start();
