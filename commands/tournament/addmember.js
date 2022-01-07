const Discord = require("discord.js");
const Colors = require("cli-color");
const Utils = require("../../Utils/Utils");
const Config = require("../../config.json");
const SQLite = require("better-sqlite3");

/**
 * 
 * @param {string} id 
 * @param {SQLite.Database} db
 */
function GetMemberByDiscordId(id, db) {
    let query = db.prepare("SELECT * FROM TournamentMembers WHERE ID = ?");
    let result = query.get(id);

    return result;
}

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {SQLite.Database} db
 */
module.exports.execute = async function (client, message, args, db) {
    if (!args || args.length == 0)
        return Utils.SendEmbedError(
            message.channel,
            `:unicorn:** Использование: \`${Config.prefix}addmember <команда> <@участник(и)>\`**`
        );

    let teamName = args.shift();
    let team = Utils.GetTeamByName(teamName, db);

    if (!team)
        return Utils.SendEmbedError(
            message.channel,
            `:unicorn: **Команда "${teamName}" не найдена.**`
        );

    if (args.length == 0 || message.mentions.members.size == 0)
        return Utils.SendEmbedError(
            message.channel,
            `:unicorn:** Вы не @упомянули участников, которых нужно добавить в команду "${teamName}".**`
        );

    let resultMessage = new Discord.MessageEmbed()
        .setTitle("Информация о добавленных участниках")
        .setColor(Config.colors.lime)
        .setFooter("Tesla-Cat created by Masya");
    let addedMembersCount = 0;

    message.mentions.members.forEach(member => {
        let dbMember = GetMemberByDiscordId(member.user.id, db);
        if (dbMember) {
            Utils.SendEmbedError(
                message.channel,
                `:unicorn:** ${member.nickname} уже является участником "${GetTeamByName(dbMember.TeamId, db).Name}".**`
            )
        }
        else {
            db.prepare("INSERT INTO TournamentMembers(MinecraftUsername, DiscordId, TeamId) VALUES(?,?,?)")
                .run(member.nickname, member.user.id, team.ID);
            addedMembersCount++;
        }
    });

    if (addedMembersCount != 0) {
        resultMessage.setDescription(`Добавлено участников в команду ${team.Name}: ${addedMembersCount}`);
        message.channel.send(resultMessage);
    }
}