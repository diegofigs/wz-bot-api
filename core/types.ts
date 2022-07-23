import { platforms } from "call-of-duty-api";
import { z } from "zod";

export const Player = z.object({
  gamertag: z.string(),
  platform: z.nativeEnum(platforms),
});
export type Player = z.infer<typeof Player>;

export const Formats = z.enum(["json", "text", "human"]);

export type CareerResponse = {
  kills: number;
  wins: number;
  kdRatio: number;
  deaths: number;
};

export type HighlightsResponse = {
  mostKills: number;
  highestKD: number;
  gamertag?: string;
};

export type LeaderboardResponse = {
  byKills: HighlightsResponse[];
  byKDR: HighlightsResponse[];
};
