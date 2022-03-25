import type { NextApiRequest, NextApiResponse } from 'next';

import { getRebirth } from '../../core';

const getRebirthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { gamertag, platform } = req.body;

  const stats = await getRebirth({ gamertag, platform });
  res.send(stats);
};

export default getRebirthHandler;