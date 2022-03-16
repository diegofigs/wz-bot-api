import type { NextApiRequest, NextApiResponse } from 'next';

import { getStats } from '../../core';

const getStatsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { gamertag, platform } = req.body;

  const stats = await getStats({ gamertag, platform });
  res.send(stats);
};

export default getStatsHandler;
