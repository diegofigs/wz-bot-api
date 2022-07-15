import type { NextApiRequest, NextApiResponse } from "next";
import { startOfDay } from "date-fns";
import { z } from "zod";

import { getRebirth, getRebirthBulk } from "core";
import {
  HighlightsResponse,
  LeaderboardResponse,
  Formats,
  Player,
} from "core/types";

const PlayerCollection = z.object({ players: z.array(Player) });

const allowedMethods = ["GET", "POST"];
const getRebirthHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse | HighlightsResponse | string>
) => {
  const { method } = req;
  if (method && !allowedMethods.includes(method)) {
    return res
      .setHeader("Allow", allowedMethods)
      .status(405)
      .end(`Method ${method} Not Allowed`);
  }

  const { body, query } = req;
  const isPost = method === "POST";
  try {
    const parsedPlayers = PlayerCollection.safeParse(isPost ? body : query);
    if (parsedPlayers.success) {
      try {
        const stats = await getRebirthBulk(parsedPlayers.data.players);
        return res.send(stats);
      } catch (error) {
        return res.status(500).end(`Error getting Rebirth highlights for players`);
      }
    }

    const parsedPlayer = Player.parse(isPost ? body : query);
    const { gamertag, platform } = parsedPlayer;
    try {
      const now = new Date();
      const interval = {
        start: startOfDay(now).getUTCSeconds(),
        end: now.getUTCSeconds(),
      };
      const stats = await getRebirth({ gamertag, platform }, interval);

      const parsedFormat = Formats.safeParse(query.format);
      const format = parsedFormat.success
        ? parsedFormat.data
        : Formats.Enum.json;
      if (format === Formats.Enum.json) {
        return res.send(stats);
      }
      if (format === Formats.Enum.text || format === Formats.Enum.human) {
        return res.send(
          `Most Kills of the day: ${stats.mostKills}, Highest KD of the day: ${stats.highestKD}`
        );
      }
    } catch (error) {
      return res.status(500).end(`Error getting Rebirth highlights for ${gamertag}`);
    }
  } catch (error) {
    return res.status(400).end("gamertag and platform are required arguments");
  }
};

export default getRebirthHandler;
