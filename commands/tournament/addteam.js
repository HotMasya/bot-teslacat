const Discord = require("discord.js");
const Colors = require("cli-color");
const Utils = require("../../Utils/Utils");
const Config = require("../../config.json");
const SQLite = require("better-sqlite3");



/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {SQLite.Database} db
 */
module.exports.execute = async function (client, message, args, db) {

    if (!args || args.length != 1)
        return Utils.SendEmbedError(message.channel,
            `:unicorn:** Использование: \`${Config.prefix}addteam <название>\`**`);

    let team = Utils.GetTeamByName(args[0], db);

    if (team)
        return Utils.SendEmbedError(message.channel,
            `:unicorn:** Команда "${args[0]}" уже существует.`);

    let query = db.prepare("INSERT INTO TournamentTeams(Name) VALUES (?)");
    query.run(args[0]);
    let successMessage = new Discord.MessageEmbed()
        .setTitle("Информация о добавленной команде")
        .setColor(Config.colors.lime)
        .setFooter("Tesla-Cat created by Masya")
        .setDescription(`Название команды: ${args[0]}`);
    message.channel.send(successMessage);
}