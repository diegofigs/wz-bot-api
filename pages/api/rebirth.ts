import type { NextApiRequest, NextApiResponse } from "next";

import { getRebirth } from "../../core";

const getRebirthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, query } = req;

  const isPOST = req.method === "POST";
  const gamertag = isPOST ? body.gamertag : query.gamertag;
  const platform = isPOST ? body.platform : query.platform;
  
  const stats = await getRebirth({ gamertag, platform });
  
  const format = body.format || query.format;
  const response = format === "text"
    ? `Most Kills of the day: ${stats.mostKills}, Highest KD of the day: ${stats.highestKD}`
    : stats;
  res.send(response);
};

export default getRebirthHandler;
