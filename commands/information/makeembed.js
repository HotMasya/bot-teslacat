const Discord = require("discord.js");
const Config = require("../../config.json");
const Utils = require("../../Utils/Utils");

/**
 *
 * @param {Discord.client} client
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.execute = async function (client, message, args) {
  if (!args || args.length == 0)
    return Utils.SendEmbedError(
      message.channel,
      ":unicorn: **Вы не указали сообщение для парсинга!**"
    );

  let parsingTarget = args.join(" ");

  let title = /\{title\}[\[\]\n\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}а-яёa-z0-9\s.,:;()\\/_=+?!#@"'^%$&*-]+\{title\}/iu;
  let color = /{color}#[a-z0-9]{6}{color}/i;
  let footer = /{footer}[\[\]\nа-яёa-z0-9\s.,:;()\\=/_+?!#@"'^%$&*-]+{footer}/i;
  let footerUrl = /{footerUrl}[а-яёa-z0-9\s.,:;()\\=/_+?!#@"'^%$&*-]+{footerUrl}/i;
  let image = /{image}[а-яёa-z0-9\s.,:;()\\=/_+?!#@"'^%$&*-]+{image}/i;
  let thumbnail = /{thumbnail}[а-яёa-z0-9\s.,:;()\\=/_+?!#@"'^%$&*-]+{thumbnail}/i;
  let field = /\{field\}[\[\]\n\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}а-яёa-z0-9\s.,:;()\\/_=+?!#@"'^%$&*-]+\{field\}/giu;
  let description = /\{description\}[\[\]\n\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}а-яёa-z0-9\s.,:;()\\/_=+?!#@"'^%$&*-]+\{description\}/iu;

  try {
    let messageEmbed = new Discord.MessageEmbed();

    if (title.test(parsingTarget)) {
      messageEmbed.setTitle(
        title.exec(parsingTarget)[0].replace(/{title}/gi, "")
      );
    }

    if (color.test(parsingTarget)) {
      messageEmbed.setColor(
        color.exec(parsingTarget)[0].replace(/{color}/gi, "")
      );
    }

    if (footer.test(parsingTarget)) {
      if (footerUrl.test(parsingTarget))
        messageEmbed.setFooter(
          footer.exec(parsingTarget)[0].replace(/{footer}/gi, ""),
          footerUrl.exec(parsingTarget)[0].replace(/{footerUrl}/gi, "")
        );
      else
        messageEmbed.setFooter(
          footer.exec(parsingTarget)[0].replace(/{footer}/gi, "")
        );
    }

    if (image.test(parsingTarget)) {
      messageEmbed.setImage(
        image
          .exec(parsingTarget)[0]
          .replace(/{image}/gi, "")
          .trim()
      );
    }

    if (thumbnail.test(parsingTarget)) {
      messageEmbed.setThumbnail(
        thumbnail
          .exec(parsingTarget)[0]
          .replace(/{thumbnail}/gi, "")
          .trim()
      );
    }

    if (field.test(parsingTarget)) {
      let fields = parsingTarget.match(field);

      fields.forEach((fieldStr) => {
        let fieldParts = fieldStr.replace(/{field}/gi, "").split("$");
        messageEmbed.addField(fieldParts[0], fieldParts[1]);
      });
    }

    if (description.test(parsingTarget)) {
      messageEmbed.setDescription(
        description.exec(parsingTarget)[0].replace(/{description}/gi, "")
      );
    }

    message.channel.send(messageEmbed);
  } catch (error) {
    Utils.SendEmbedError(
      message.channel,
      ":unicorn: **Произошла ошибка во время парсинга сообщения.**"
    );
    console.log(error);
  }
};
