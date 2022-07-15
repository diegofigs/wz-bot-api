import type { NextApiRequest, NextApiResponse } from "next";
import { startOfDay } from "date-fns";

import { getHighlights } from "core";
import { HighlightsResponse, Formats, Player } from "core/types";

const allowedMethods = ["GET", "POST"];
const getHighlightsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<HighlightsResponse | string>
) => {
  const { method } = req;
  if (method && !allowedMethods.includes(method)) {
    return res
      .setHeader("Allow", allowedMethods)
      .status(405)
      .end(`Method ${method} Not Allowed`);
  }

  const { body, query } = req;
  try {
    const player = Player.parse(method === "POST" ? body : query);
    const { gamertag, platform } = player;
    try {
      const now = new Date();
      const interval = {
        start: startOfDay(now).getSeconds(),
        end: now.getSeconds(),
      };
      const highlights = await getHighlights({ gamertag, platform }, interval);

      const parsedFormat = Formats.safeParse(query.format);
      const format = parsedFormat.success
        ? parsedFormat.data
        : Formats.Enum.json;
      if (format === Formats.Enum.json) {
        return res.send(highlights);
      }
      if (format === Formats.Enum.text || format === Formats.Enum.human) {
        return res.send(
          `Most Kills of the day: ${highlights.mostKills}, Highest KD of the day: ${highlights.highestKD}`
        );
      }
    } catch (error) {
      return res.status(500).end(`Error getting BR highlights for ${gamertag}`);
    }
  } catch (error) {
    return res.status(400).end("gamertag and platform are required arguments");
  }
};

export default getHighlightsHandler;
