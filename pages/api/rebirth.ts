import { platforms } from "call-of-duty-api";
import type { NextApiRequest, NextApiResponse } from "next";

import { getRebirth } from "../../core";

enum Formats {
  json = "json",
  text = "text",
  human = "human",
}

const getRebirthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET": {
      const { query } = req;
      const gamertag = query.gamertag as string;
      const platform = query.platform as platforms;
      const responseFormat = query.format as string;


      const format = responseFormat || Formats.json;
      if (!Object.values(Formats).includes(format as Formats)) {
        res.status(400).end(`"${format}" is not a valid format, use <${Formats.json}|${Formats.text}|${Formats.human}> instead`);
      }

      try {
        const stats = await getRebirth({ gamertag, platform });
        if (format === Formats.json) {
          res.send(stats);
        }
        if (format === Formats.text || format === Formats.human) {
          res.send(`Most Kills of the day: ${stats.mostKills}, Highest KD of the day: ${stats.highestKD}`);
        }
      } catch (error) {
        res.status(500).end(`Error getting rebirth stats for ${gamertag}`)
      }
      break;
    }
    default: {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};

export default getRebirthHandler;
