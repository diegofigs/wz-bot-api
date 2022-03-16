import type { NextApiRequest, NextApiResponse } from 'next';

import { getCareer } from 'core';
import { CareerResponse } from 'core/types';

const getCareerHandler = async (req: NextApiRequest, res: NextApiResponse<CareerResponse>) => {
  const { gamertag, platform } = req.body;

  const career = await getCareer({ gamertag, platform });
  res.send(career);
};

export default getCareerHandler;
