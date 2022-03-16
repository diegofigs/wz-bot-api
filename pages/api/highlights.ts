import type { NextApiRequest, NextApiResponse } from 'next';
import { startOfDay } from 'date-fns';

import { getHighlights } from '../../core';

type HighlightsData = {
  gamertag?: string,
  mostKills?: number,
  highestKD?: number
};

export default async (req: NextApiRequest, res: NextApiResponse<HighlightsData>) => {
  const { gamertag, platform } = req.body;

  const now = new Date();
  const interval = { start: startOfDay(now).getSeconds(), end: now.getSeconds() };
  const highlights = await getHighlights({ gamertag, platform }, interval);

  res.send(highlights);
};
