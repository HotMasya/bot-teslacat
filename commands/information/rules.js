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
      "Попрошу тебя ознакомиться с правилами перед тем, как начать своё общение на нашем замечательном сервере :slight_smile:\n\n**Содержание:**\n[1. Основной свод правил](https://discord.gg/9x5CgVm)\n[2. Правила голосовых каналов](https://discord.gg/9x5CgVm)\n[3. Правила текстовых каналов](https://discord.gg/9x5CgVm)\n[4. Правила приватных каналов](https://discord.gg/9x5CgVm)\n[5. Терминология](https://discord.gg/9x5CgVm)"
    )
    .setColor(Config.colors.lime);

  await message.channel.send(titleMessage);

  let basicRulesList = [
    "Незнание правил не освобождает вас от ответственности!",
    "Соблюдайте **[условия использования Discord](https://discord.com/new/terms)**.",
    "Соблюдайте **[правила сообщества Discord](https://discord.com/new/guidelines)**.",
    "Уважительно относитесь к другим участникам сервера.",
    "Не провоцируйте и не поддерживайте развитие конфликтных ситуаций.",
    "Соблюдайте **[правила поведения на сервере Tesla-Craft](https://teslacraft.org/threads/Обновлено-16-07-2020-Свод-правил-сервера-и-полезная-информация-для-игроков-и-блюстителей.118676/)**.",
    "Запрещено использование недопустимых никнеймов[¹](https://discord.gg/9x5CgVm).",
    "Запрещен расизм, нацизм, политика и т.д.[²](https://discord.gg/9x5CgVm)",
    "Запрещена реклама сторонних серверов Discord, сайтов и т.д.[³](https://discord.gg/9x5CgVm)",
    "Запрещены троллинг, рофлы[⁴](https://discord.gg/9x5CgVm), агрессия, флейм[⁵](https://discord.gg/9x5CgVm).",
    "Запрещено вводить в заблужение модерацию, а также дезинформировать, обмановать и т.д.[⁶](https://discord.gg/9x5CgVm)",
    "Запрещено попрошайничество в любых его проявлениях.",
    "Запрещён порнографический контент в любом виде.",
    "Запрещено расспространение вредоносного ПО и любых читов.",
    "Запрещено использование твинк-аккаунтов. (На сервере может быть только ваш единственный и основной аккаунт)",
    "Запрещено распространение личной информации пользователя[¹²](https://discord.gg/9x5CgVm).",
  ];

  let basicRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":one: Основной свод правил:");
  let description = "";
  for (let i = 0; i < basicRulesList.length; i++)
    description += `\`1.${i + 1}\` ` + basicRulesList[i] + "\n";

  await message.channel.send(basicRulesMessage.setDescription(description));

  let voiceChatRules = [
    "Использование нецензурной, аморальной лексики.",
    "Непристойное поведение, троллинг[⁷](https://discord.gg/9x5CgVm), флейм[⁵](https://discord.gg/9x5CgVm), рофлы[⁴](https://discord.gg/9x5CgVm), агрессия.",
    "Злоупотреблять переходами между голосовыми каналами.",
    "Громкие, резкие звуки[⁸](https://discord.gg/9x5CgVm).",
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
  await message.channel.send(voiceChatRulesMessage.setDescription(description));

  let textChatRules = [
    "Массовое упоминание пользователей, ролей.",
    "Чрезмерное использование эмодзи.",
    "Использовать нецензурную или аморальную лексику.",
    "Употреблять завуалированный мат[⁹](https://discord.gg/9x5CgVm).",
    'Намеренная "кража" музыкального бота.',
    "Намеренный заказ музыки без согласия других участников чата.",
    "Спам[¹⁰](https://discord.gg/9x5CgVm), флуд[¹¹](https://discord.gg/9x5CgVm), флейм[⁵](https://discord.gg/9x5CgVm), чрезмерное использование букв верхнего регистра.",
    "Отправлять аморльные, оскорбительные сообщения, видео, изображения, эмодзи, аудиофайлы.",
  ];

  let textChatRulesMessage = new Discord.MessageEmbed()
    .setColor(Config.colors.lime)
    .setTitle(":three: В текстовых каналах запрещено:");
  description = "";
  for (let i = 0; i < textChatRules.length; i++)
    description += `\`3.${i + 1}\` ` + textChatRules[i] + "\n";
  await message.channel.send(textChatRulesMessage.setDescription(description));

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
  await message.channel.send(
    privateChatRulesMessage.setDescription(description)
  );

  let terminologyImage = new Discord.MessageEmbed()
    .setDescription("***[   TERMINOLOGY TITLE IMAGE PLACEHOLDER    ]***")
    .setColor(Config.colors.lime);

  await message.channel.send(terminologyImage);

  let terminology = [
    "```md\n[1.] Зарещено использование следующих ников:\n⦁ Ники, несущие оскорбительный или аморальный характер;\n⦁ Ники, содержащие маты;\n⦁ Ники, содержащие суицидальную тематику;\n*Администрация оставляет за собой право запрещать любые другие ники, слова и т.д.*```",
    "```md\n[2.] Запрещён расизм, нацизм, фашизм, розжиг межрасовой розни, пропаганда и упоминание суицида, упоминание террористических организаций, политика и её обсуждение, упоминание и обсуждение наркотических веществ (и их действий, воздействий). Обсуждение веры, религии.```",
    "```md\n[3.] Запрещена реклама на сервере и в качестве рассылки в лс участникам сервера, разговоры о сторонних Discord- и Minecraft- серверах, статусы, содержащие рекламу. (Без согласия администрации)```",
    '```md\n[4.] Оскорбление - употребление нецензурной брани или любых оскорбительных слов в сторону других участников. Это касается и оскорблений "в шутку", ненаправленных оскорблений, завуалированных сообщений, оскорблений участников, которых нету на сервере и т. п.```',
    "```md\n[5.] Флейм - диалог, в котором участники провоцируют друг друга, который плавно переходит в ссору.```",
    "```md\n[6.] Запрещается вводить в заблуждение участников сервера. Также запрещено распространение багов, или глюков.```",
    "```md\n[7.] Троллинг - форма социальных провокаций и издевательств в сетевом общении.```",
    "```md\n[8.] Громкие звуки - собственная музыка, громкий фон, громкие резкие звуки в голосовых чатах, а также гимны, эхо, шум, крики в микрофон, прочие неприятные для участников голосового канала звуки. (Перед входом убедитесь, что ваш микрофон исправен)```",
    "```md\n[9.] Завуалированный мат - это замена нецензурных, аморальных, ненормативных слов или выражений на аналогичные с целью смягчить их, но суть заменяемого слова/выражения чётко ясна. Замена символа тоже считается.```",
    "```md\n[10.] Спам - умышленная и многократная отправка сообщений.```",
    "```md\n[11.] Фдуд - несколько сообщений подряд одинакового содержания, в том числе и реакций.```",
    "```md\n[12.] Запрещено распространение личной информации и данных пользователей без их согласия: ФИО/ФИ/ФО/ОИ, место жительства, работы, учёбы, адреса страниц и профилей в соц. сетях. Фото и видеоматериалы, на которых изображено лицо, внешность пользователя.```",
  ];

  terminology.forEach((desc) => {
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(desc)
        .setColor(Config.colors.orange)
    );
  });
};
