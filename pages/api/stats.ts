import type { NextApiRequest, NextApiResponse } from 'next';
import { startOfDay } from 'date-fns';

import { getPlayerHighlights } from '../../core';

type StatsData = {
  mostKills: number,
  highestKD: number
};

const getStats = async (req: NextApiRequest, res: NextApiResponse<StatsData>) => {
  const { gamertag, platform } = req.body;

  const now = new Date();
  const interval = { start: startOfDay(now), end: now };
  const highlights = await getPlayerHighlights({ gamertag, platform }, interval);

  res.send(highlights);
};

export default getStats;
