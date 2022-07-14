import { request } from "gaxios";
import players from "./data";

const API = "https://wz-bot-api-e6rusiaura-ue.a.run.app/api";

const headers = { "Content-Type": "application/json" };

export const getRebirthBulk = async () => {
  try {
    const response = await request({
      url: `${API}/rebirth`,
      method: "POST",
      headers,
      data: { players },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { byKills: [], byKDR: [] };
  }
};
