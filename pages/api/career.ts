import type { NextApiRequest, NextApiResponse } from "next";

import { getCareer } from "core";
import { CareerResponse, Player } from "core/types";

const allowedMethods = ["GET", "POST"];
const getCareerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CareerResponse>
) => {
  const { method } = req;
  if (method && allowedMethods.includes(method)) {
    const { body, query } = req;

    let player;
    try {
      player = method === "POST" ? Player.parse(body) : Player.parse(query);
    } catch (error) {
      return res
        .status(400)
        .end("gamertag and platform are required arguments");
    }

    const { gamertag, platform } = player;
    try {
      const career = await getCareer({ gamertag, platform });
      return res.send(career);
    } catch (error) {
      return res.status(500).end(`Error getting BR career for ${gamertag}`);
    }
  }
};

export default getCareerHandler;
