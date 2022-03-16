import type { NextApiRequest, NextApiResponse } from 'next';

import { getStats } from '../../core';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { gamertag, platform } = req.body;

  const stats = await getStats({ gamertag, platform });
  res.send(stats);
};
