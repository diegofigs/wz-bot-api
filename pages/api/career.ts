import type { NextApiRequest, NextApiResponse } from 'next';

import { getCareer } from '../../core';

type CareerData = {
  kills?: number,
  wins?: number,
  kdRatio?: number,
  deaths?: number,
};

export default async (req: NextApiRequest, res: NextApiResponse<CareerData>) => {
  const { gamertag, platform } = req.body;

  const career = await getCareer({ gamertag, platform });
  res.send(career);
};
