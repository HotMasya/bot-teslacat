const Discord = require("discord.js");
const Config = require("../../config.json");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.execute = async function (client, message, args) {
  let titleMessage = new Discord.MessageEmbed()
    .setTitle("Здравствуй, дорогой друг!")
    .setDescription(
      "Попрошу тебя ознакомиться с правилами перед тем, как начать своё общение на нашем замечательном сервере :slight_smile:\n\n**Содержание:**\n[1. Основной свод правил](https://discordapp.com/channels/494532701345284098/735802353755881513/737596784569876481)\n[2. Правила голосовых каналов](https://discordapp.com/channels/494532701345284098/735802353755881513/737596785861722203)\n[3. Правила текстовых каналов](https://discordapp.com/channels/494532701345284098/735802353755881513/737596786973081603)\n[4. Правила приватных каналов](https://discordapp.com/channels/494532701345284098/735802353755881513/737596787971457108)\n[5. Терминология](https://discordapp.com/channels/494532701345284098/735802353755881513/737596808062304287)"
    )
    .setColor(Config.colors.lime);

  await message.channel.messages
    .fetch("737596782346764339")
    .then((m) => m.edit(titleMessage))
    .catch(console.error);

  let basicRulesList = [
    "Незнание правил не освобождает вас от ответственности!",
    "Соблюдайте **[условия использования Discord](https://discord.com/new/terms)**.",
    "Соблюдайте **[правила сообщества Discord](https://discord.com/new/guidelines)**.",
    "Уважительно относитесь к другим участникам сервера.",
    "Не провоцируйте и не поддерживайте развитие конфликтных ситуаций.",
    "Соблюдайте **[правила поведения на сервере Tesla-Craft](https://teslacraft.org/threads/Обновлено-16-07-2020-Свод-правил-сервера-и-полезная-информация-для-игроков-и-блюстителей.118676/)**.",
    "Запрещено использование недопустимых никнеймов[¹](https://discordapp.com/channels/494532701345284098/735802353755881513/737596809186115604).",
    "Запрещен расизм, нацизм, политика и т.д.[²](https://discordapp.com/channels/494532701345284098/735802353755881513/737596810151067758)",
    "Запрещена реклама сторонних серверов Discord, сайтов и т.д.[³](https://discordapp.com/channels/494532701345284098/735802353755881513/737596811153375233)",
    "Запрещены троллинг, рофлы[⁴](https://discordapp.com/channels/494532701345284098/735802353755881513/737596812197756938), агрессия, флейм[⁵](https://discordapp.com/channels/494532701345284098/735802353755881513/737596832028557393).",
    "Запрещено вводить в заблужение модерацию, а также дезинформировать, обмановать и т.д.[⁶](https://discordapp.com/channels/494532701345284098/735802353755881513/737596832909361212)",
    "Запрещено попрошайничество в любых его проявлениях.",
    "Запрещён порнографический контент в любом виде.",
    "Запрещено расспространение вредоносного ПО и любых читов.",
    "Запрещено использование твинк-аккаунтов. (На сервере может быть только ваш единственный и основной аккаунт)",
    "Запрещено распространение личной информации пользователя[¹²](https://discordapp.com/channels/494532701345284098/735802353755881513/737596861543612496).",
  ];

  let basicRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":one: Основной свод правил:");
  let description = "";
  for (let i = 0; i < basicRulesList.length; i++)
    description += `\`1.${i + 1}\` ` + basicRulesList[i] + "\n";

  await message.channel.messages
    .fetch("737596784569876481")
    .then((m) => m.edit(basicRulesMessage.setDescription(description)))
    .catch(console.error);

  let voiceChatRules = [
    "Использование нецензурной, аморальной лексики.",
    "Непристойное поведение, троллинг[⁷](https://discordapp.com/channels/494532701345284098/735802353755881513/737596833785970769), флейм[⁵](https://discordapp.com/channels/494532701345284098/735802353755881513/737596832028557393), рофлы[⁴](https://discordapp.com/channels/494532701345284098/735802353755881513/737596812197756938), агрессия.",
    "Злоупотреблять переходами между голосовыми каналами.",
    "Громкие, резкие звуки[⁸](https://discordapp.com/channels/494532701345284098/735802353755881513/737596834360590338).",
    "Намеренно перебивать собеседников.",
    "Изменять голос с помощью программ.",
    "Транслировать порнографический или аморальный контент.",
  ];

  let voiceChatRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":two: В голосовых каналах запрещено:");
  description = "";
  for (let i = 0; i < voiceChatRules.length; i++)
    description += `\`2.${i + 1}\` ` + voiceChatRules[i] + "\n";

  await message.channel.messages
    .fetch("737596785861722203")
    .then((m) => m.edit(voiceChatRulesMessage.setDescription(description)))
    .catch(console.error);

  let textChatRules = [
    "Массовое упоминание пользователей, ролей.",
    "Чрезмерное использование эмодзи.",
    "Использовать нецензурную или аморальную лексику.",
    "Употреблять завуалированный мат[⁹](https://discordapp.com/channels/494532701345284098/735802353755881513/737596835602104330).",
    'Намеренная "кража" музыкального бота.',
    "Намеренный заказ музыки без согласия других участников чата.",
    "Спам[¹⁰](https://discordapp.com/channels/494532701345284098/735802353755881513/737596859404779562), флуд[¹¹](https://discordapp.com/channels/494532701345284098/735802353755881513/737596860587442246), флейм[⁵](https://discordapp.com/channels/494532701345284098/735802353755881513/737596832028557393), чрезмерное использование букв верхнего регистра.",
    "Отправлять аморльные, оскорбительные сообщения, видео, изображения, эмодзи, аудиофайлы.",
  ];

  let textChatRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":three: В текстовых каналах запрещено:");
  description = "";
  for (let i = 0; i < textChatRules.length; i++)
    description += `\`3.${i + 1}\` ` + textChatRules[i] + "\n";

  await message.channel.messages
    .fetch("737596786973081603")
    .then((m) => m.edit(textChatRulesMessage.setDescription(description)))
    .catch(console.error);

  let privateChatRules = [
    "Использование нецензурных, оскорбительных или аморальных названий личных каналов.",
    'Оскорблять пользователей, посылать их "куда подальше".',
  ];

  let privateChatRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":four: В приватных каналах запрещено:");
  description = "";
  for (let i = 0; i < privateChatRules.length; i++)
    description += `\`4.${i + 1}\` ` + privateChatRules[i] + "\n";

  await message.channel.messages
    .fetch("737596787971457108")
    .then((m) => m.edit(privateChatRulesMessage.setDescription(description)))
    .catch(console.error);
};
