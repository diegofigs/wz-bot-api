import type { NextApiRequest, NextApiResponse } from 'next';

import { getStats } from 'core';
import { Player } from 'core/types';

const allowedMethods = ["GET", "POST"];
const getStatsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method && !allowedMethods.includes(method)) {
    return res
      .setHeader("Allow", allowedMethods)
      .status(405)
      .end(`Method ${method} Not Allowed`);
  }

  const { body, query } = req;
  try {
    const player = Player.parse(method === 'POST' ? body : query);
    const { gamertag, platform } = player;
    try {
      const stats = await getStats({ gamertag, platform });
      return res.send(stats);
    } catch (error) {
      return res.status(500).end(`Error getting stats for ${gamertag}`);
    }
  } catch (error) {
    return res.status(400).end('gamertag and platform are required arguments');
  }
};

export default getStatsHandler;
