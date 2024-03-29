import { login, Warzone } from "@diegofigs/call-of-duty";
import { Interval } from "date-fns";

import {
  CareerResponse,
  HighlightsResponse,
  LeaderboardResponse,
} from "./types";
import type { Player } from "./types";

let loggedIn: boolean;
if (process.env.SSO_TOKEN) {
  loggedIn = login(process.env.SSO_TOKEN);
}

/**
 * Getter function that fetches important player KPIs
 * @param {Player} player
 * @returns
 */
export const getCareer = async (player: Player): Promise<CareerResponse> => {
  if (!loggedIn) {
    throw new Error("not logged in");
  }

  const { gamertag, platform } = player;
  const { data: careerData } = await Warzone.fullData(gamertag, platform);

  const stats = careerData.lifetime.mode.br.properties;
  const { kills, wins, kdRatio, deaths } = stats;

  return {
    kills,
    wins,
    kdRatio,
    deaths,
  };
};

/**
 * Thin wrapper around base API's combat history, fetches last 20 matches
 * along with player summary.
 * @param {Player} player
 * @returns
 */
export const getStats = async (player: Player) => {
  if (!loggedIn) {
    throw new Error("not logged in");
  }

  const { gamertag, platform } = player;
  const { data: combatData } = await Warzone.combatHistory(gamertag, platform);

  return combatData;
};

/**
 * Get match stats from `player`; delimited by an optional `interval paramater.
 * @param {Player} player
 * @param {Interval} interval
 * @returns
 */
export const getHighlights = async (
  player: Player,
  interval: Interval
): Promise<HighlightsResponse> => {
  if (!loggedIn) {
    throw new Error("not logged in");
  }

  const { gamertag, platform } = player;
  const { data: combatData } = await Warzone.combatHistoryWithDate(
    gamertag,
    interval.start as number,
    interval.end as number,
    platform
  );

  const response = combatData.matches.reduce(
    (acc: any, match: any) => {
      const { mostKills, highestKD } = acc;
      const { kills, kdRatio } = match.playerStats;

      return {
        mostKills: !mostKills || mostKills < kills ? kills : mostKills,
        highestKD: !highestKD || highestKD < kdRatio ? kdRatio : highestKD,
      };
    },
    { mostKills: 0, highestKD: 0 }
  );
  return response;
};

export const getRebirth = async (
  player: Player,
  _interval?: Interval
): Promise<HighlightsResponse> => {
  if (!loggedIn) {
    throw new Error("not logged in");
  }

  const { gamertag, platform } = player;
  const { data: combatData } = await Warzone.combatHistory(gamertag, platform);
  const rebirthMatches = combatData.matches.filter((match: any) =>
    match.mode.includes("br_rebirth")
  );
  const response = rebirthMatches.reduce<HighlightsResponse>(
    (acc: any, match: any) => {
      const { mostKills, highestKD } = acc;
      const { kills, kdRatio } = match.playerStats;

      return {
        mostKills: !mostKills || mostKills < kills ? kills : mostKills,
        highestKD: !highestKD || highestKD < kdRatio ? kdRatio : highestKD,
      };
    },
    { mostKills: 0, highestKD: 0 }
  );
  return response;
};

export const getRebirthBulk = async (
  players: Player[],
  _opts: any = {}
): Promise<LeaderboardResponse> => {
  if (!loggedIn) {
    throw new Error("not logged in");
  }

  const playerStats = await Promise.all(
    players.map(async (player) => {
      const rebirthHighlights = await getRebirth(player);
      return { gamertag: player.gamertag, ...rebirthHighlights };
    })
  );
  const playerEntries = playerStats.filter(
    ({ mostKills, highestKD }) => mostKills || highestKD
  );

  return {
    byKills: [...playerEntries].sort((a, b) => b.mostKills - a.mostKills),
    byKDR: [...playerEntries].sort((a, b) => b.highestKD - a.highestKD),
  };
};
