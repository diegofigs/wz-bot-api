import { request } from "gaxios";
import players from "./data.js";

const API = "https://wz-bot-api-e6rusiaura-ue.a.run.app/api";

const headers = { "Content-Type": "application/json" };

export type HighlightsResponse = {
  mostKills: number;
  highestKD: number;
  gamertag?: string;
};

export type LeaderboardResponse = {
  byKills: HighlightsResponse[];
  byKDR: HighlightsResponse[];
};

export const getRebirthBulk = async () => {
  try {
    const response = await request({
      url: `${API}/rebirth`,
      method: "POST",
      headers,
      data: { players },
    });
    return response.data as LeaderboardResponse;
  } catch (error) {
    console.error(error);
    return { byKills: [], byKDR: [] };
  }
};
