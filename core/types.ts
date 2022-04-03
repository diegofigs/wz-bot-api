export enum Formats {
  json = "json",
  text = "text",
  human = "human",
};

export type CareerResponse = {
  kills?: number;
  wins?: number;
  kdRatio?: number;
  deaths?: number;
};

export type HighlightsResponse = {
  mostKills?: number,
  highestKD?: number,
  gamertag?: string
};

export type LeaderboardResponse = {
  byKills: HighlightsResponse[],
  byKDR: HighlightsResponse[]
}
