const TeslaCommandParser = require("./TeslaCommandParser");
const { Base } = require("discord.js");

module.exports = class extends TeslaCommandParser {
  constructor() {
    super();
    this.lookup = {};
  }

  StartCondition(json) {
    return (
      json.extra && json.extra[0].color == "dark_green" && !this.parsingStarted
    );
  }

  EndCondition(json) {
    return (
      json.extra && json.extra[0].color == "dark_green" && this.parsingStarted
    );
  }

  Read(json) {
    if (
      json.extra &&
      json.extra[0].color == "dark_green" &&
      !this.parsingStarted
    ) {
      this.dataArray.push(json.extra[3].text);
      this.parsingStarted = true;
    } else if (
      json.extra &&
      json.extra[0].color == "dark_green" &&
      this.parsingStarted
    ) {
      this.Parse();
      this.parsingStarted = false;
    } else {
      this.dataArray.push(json.text);
      if (json.extra) {
        this.dataArray.push(json.extra[0].text);
      }
    }
  }

  Parse() {
    if (this.dataArray.length === 0) {
      this.lookup = null;
    } else {
      this.Filter();

      this.SetUsername();
      this.SetStatus();
      this.SetRank();
      if (this.lookup.status) this.SetPlace();
      this.SetBannedStatus();
      this.SetMuteStatus();
      this.SetFirstServerEntry();
      this.SetLastServerEntry();
      this.SetHistory();
    }

    this.emit("end", this.lookup);
  }

  Filter() {
    this.dataArray = this.dataArray.filter(
      (string) => string[13] != "-" && string.length > 0 && string != '[" "]'
    );
  }

  SetUsername() {
    this.lookup.username = this.dataArray.shift().trim();
  }

  SetStatus() {
    let statusString = this.dataArray.shift();
    if (statusString.includes("Офлайн")) this.lookup.status = false;
    else if (statusString.includes("Онлайн")) this.lookup.status = true;
    else this.lookup.status = null;
  }

  SetBannedStatus() {
    let splittedBannedStatus = this.dataArray.shift().split('"');
    this.lookup.bannedStatus =
      splittedBannedStatus[splittedBannedStatus.length - 2];
  }

  SetMuteStatus() {
    let splittedMuteStatus = this.dataArray.shift().split('"');
    this.lookup.muteStatus = splittedMuteStatus[splittedMuteStatus.length - 2];
  }

  SetFirstServerEntry() {
    let splittedEntry = this.dataArray.shift().split('"');
    this.lookup.firstEntry = splittedEntry[splittedEntry.length - 2];
  }

  SetLastServerEntry() {
    let splittedEntry = this.dataArray.shift().split('"');
    this.lookup.lastEntry = splittedEntry[splittedEntry.length - 2];
  }

  SetHistory() {
    this.lookup.history = [];
    this.dataArray.shift();

    for (let i = 0; i < 4; i++) {
      let splittedHistoryElements = this.dataArray.shift().split('"');
      this.lookup.history.push(
        splittedHistoryElements[splittedHistoryElements.length - 2]
      );
    }
  }

  SetRank() {
    let rankString = this.dataArray.shift();
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

    this.lookup.rank = availableRanks[0];
    for (let i = 1; i < availableRanks.length; i++)
      if (rankString.includes(availableRanks[i]))
        this.lookup.rank = availableRanks[i];
  }

  SetPlace() {
    this.dataArray.shift();
    this.lookup.place = this.dataArray.shift();
  }
};
