import type { NextApiRequest, NextApiResponse } from 'next';
import { startOfDay } from 'date-fns';

import { getHighlights } from 'core';
import { HighlightsResponse } from 'core/types';

export default async (req: NextApiRequest, res: NextApiResponse<HighlightsResponse>) => {
  const { gamertag, platform } = req.body;

  const now = new Date();
  const interval = { start: startOfDay(now).getSeconds(), end: now.getSeconds() };
  const highlights = await getHighlights({ gamertag, platform }, interval);

  res.send(highlights);
};
