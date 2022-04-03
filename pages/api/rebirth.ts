import type { NextApiRequest, NextApiResponse } from "next";
import { platforms } from "call-of-duty-api";
import { startOfDay } from "date-fns";

import { getRebirth, getRebirthBulk } from "core";
import { HighlightsResponse, Formats, LeaderboardResponse } from "core/types";
import { Player } from "core/interfaces";

const allowedMethods = ["GET", "POST"];
const getRebirthHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse | HighlightsResponse | string>
) => {
  const { method } = req;
  if (allowedMethods.includes(method)) {
    const { body, query } = req;
    const gamertag = (body.gamertag || query.gamertag) as string;
    const platform = (body.platform || query.platform) as platforms;
    const players = body.players;

    if (!players && (!gamertag || !platform)) {
      res.status(400).end("gamertag and platform are required arguments");
      return;
    }

    if (players) {
      const isValidFormat = players.every((p: Player) => p.gamertag && p.platform);
      if (isValidFormat) {
        const stats = await getRebirthBulk(players);
        res.send(stats);
      } else {
        res
          .status(400)
          .end(
            `"players" is invalid, ensure all entries include a gamertag and platform`
          );
      }
      return;
    }

    const responseFormat = query.format as string;
    const format = responseFormat || Formats.json;
    if (!Object.values(Formats).includes(format as Formats)) {
      res
        .status(400)
        .end(
          `"${format}" is not a valid format, use <${Formats.json}|${Formats.text}|${Formats.human}> instead`
        );
      return;
    }

    try {
      const now = new Date();
      const interval = {
        start: startOfDay(now).getUTCSeconds(),
        end: now.getUTCSeconds(),
      };
      const stats = await getRebirth({ gamertag, platform }, interval);
      if (format === Formats.json) {
        res.send(stats);
      }
      if (format === Formats.text || format === Formats.human) {
        res.send(
          `Most Kills of the day: ${stats.mostKills}, Highest KD of the day: ${stats.highestKD}`
        );
      }
    } catch (error) {
      res.status(500).end(`Error getting Rebirth highlights for ${gamertag}`);
    }
  } else {
    res.setHeader("Allow", allowedMethods);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default getRebirthHandler;
