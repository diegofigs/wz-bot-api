import type { NextApiRequest, NextApiResponse } from 'next';
import { platforms } from 'call-of-duty-api';

import { getStats } from 'core';

const allowedMethods = ["GET", "POST"];
const getStatsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (allowedMethods.includes(method)) {
    const { body, query } = req;
    const gamertag = (body.gamertag || query.gamertag) as string;
    const platform = (body.platform || query.platform) as platforms;
    if (!gamertag || !platform) {
      res.status(400).end('gamertag and platform are required arguments');
      return;
    }
    try {
      const stats = await getStats({ gamertag, platform });
      res.send(stats);
    } catch (error) {
      res.status(500).end(`Error getting stats for ${gamertag}`);
    }
    
  } else {
    res.setHeader("Allow", allowedMethods);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default getStatsHandler;
