import { MessageEmbed, WebhookClient } from "discord.js";

import { getRebirthBulk } from "./api";
import { emojis, thumbnail } from "./config";

const webhookClient = new WebhookClient({
  url: process.env.DISCORD_LEADERBOARD_WEBHOOK_URL,
});

const getPositionEmoji = (position) => {
  switch (position) {
    case 1:
      return emojis.crown;
    case 2:
      return emojis.runner;
    default:
      return "";
  }
};

const getNumberEmoji = (position) => emojis[position];

const HIGH_KILL_THRESHOLD = 20;
const GREAT_KILL_THRESHOLD = 13;
const GOOD_KILL_THRESHOLD = 10;
const NICE_KILL_THRESHOLD = 5;
const CHURRO = 1;
const DONUT = 0;
const getKillAccoladeEmoji = (kills) => {
  if (kills >= HIGH_KILL_THRESHOLD) {
    return emojis.bomb;
  }
  if (kills >= GREAT_KILL_THRESHOLD) {
    return emojis.green_heart;
  }
  if (kills >= GOOD_KILL_THRESHOLD) {
    return emojis.yellow_heart;
  }
  if (kills >= NICE_KILL_THRESHOLD) {
    return emojis.red_heart;
  }
  if (kills === CHURRO) {
    return emojis.bread;
  }
  if (kills === DONUT) {
    return emojis.donut;
  }
  return "";
};

const HIGH_KD_THRESHOLD = 10;
const GREAT_KD_THRESHOLD = 6;
const GOOD_KD_THRESHOLD = 3;
const getKillDeathAccoladeEmoji = (kd) => {
  if (kd >= HIGH_KD_THRESHOLD) {
    return emojis.green_heart;
  }
  if (kd >= GREAT_KD_THRESHOLD) {
    return emojis.yellow_heart;
  }
  if (kd >= GOOD_KD_THRESHOLD) {
    return emojis.red_heart;
  }
  return "";
};

const JOB_NAME = "sendLeaderboard";
const embedColor = "#0099ff";
const killsTitle = "Kills Leaderboard";
const kdTitle = "KD Leaderboard";
const description = "Based on today's matches";
const footer = { text: "This information is property of Infinity Ward" };

const sendLeaderboard = async (message) => {
  console.log(`[${JOB_NAME}] started at ${new Date(message.publishTime)}`);
  const { byKills, byKDR } = await getRebirthBulk();

  const killsFields = byKills.map(({ gamertag, mostKills }, i) => {
    const position = i + 1;
    const name = `${
      getNumberEmoji(position) || `**${position}**`
    } ${getPositionEmoji(position)} **${gamertag}**`;
    const value = `${getKillAccoladeEmoji(mostKills)} ${mostKills} Kills`;
    return { name, value };
  });
  const killsLeaderboardEmbed = new MessageEmbed()
    .setColor(embedColor)
    .setTitle(killsTitle)
    .setDescription(description)
    .setThumbnail(thumbnail)
    .addFields(killsFields)
    .setTimestamp()
    .setFooter(footer);

  const ratioFields = byKDR.map(({ gamertag, highestKD }, i) => {
    const position = i + 1;
    const name = `${
      getNumberEmoji(position) || `**${position}**`
    } ${getPositionEmoji(position)} **${gamertag}**`;
    const value = `${getKillDeathAccoladeEmoji(highestKD)} ${highestKD} KD`;
    return { name, value };
  });
  const ratioLeaderboardEmbed = new MessageEmbed()
    .setColor(embedColor)
    .setTitle(kdTitle)
    .setDescription(description)
    .setThumbnail(thumbnail)
    .addFields(ratioFields)
    .setTimestamp()
    .setFooter(footer);
  await webhookClient.send({
    embeds: [killsLeaderboardEmbed, ratioLeaderboardEmbed],
  });

  console.log(`[${JOB_NAME}] finished at ${new Date()}`);
};
export default sendLeaderboard;
