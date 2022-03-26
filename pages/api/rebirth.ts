import type { NextApiRequest, NextApiResponse } from "next";

import { getRebirth } from "../../core";

enum Formats {
  json = "json",
  text = "text",
  human = "human"
}

const getRebirthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, query } = req;

  const isPOST = req.method === "POST";
  const gamertag = isPOST ? body.gamertag : query.gamertag;
  const platform = isPOST ? body.platform : query.platform;
  
  const stats = await getRebirth({ gamertag, platform });
  
  const sentFormat = body.format || query.format;
  const format = sentFormat || Formats.json;
  switch (format) {
    case Formats.json: {
      res.send(stats);
      return;
    }
    case Formats.text: {
      res.send(JSON.stringify(stats));
      return;
    }
    case Formats.human: {
      res.send(`Most Kills of the day: ${stats.mostKills}, Highest KD of the day: ${stats.highestKD}`);
      return;
    }
    default:
      res.send(stats);
      return;
  }
};

export default getRebirthHandler;
