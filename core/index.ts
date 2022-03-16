import { login, Warzone } from 'call-of-duty-api';
import { Interval } from 'date-fns';

import { Player } from './interfaces';
import { CareerResponse, HighlightsResponse } from './types';

export const loginToCOD = async () => {
  const loggedIn = login(process.env.SSO_TOKEN);
  return loggedIn;
};

/**
 * Getter function that fetches important player KPIs
 * @param {Player} player
 * @returns
 */
export const getCareer = async (player: Player): Promise<CareerResponse> => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return {};
  }

  const { gamertag, platform } = player;
  const { data: careerData } = await Warzone.fullData(gamertag, platform);

  const stats = careerData.lifetime.mode.br.properties;
  const {
    kills, wins, kdRatio, deaths,
  } = stats;

  return {
    kills, wins, kdRatio, deaths,
  };
};

/**
 * Thin wrapper around base API's combat history, fetches last 20 matches
 * along with player summary.
 * @param {Player} player
 * @returns
 */
export const getStats = async (player: Player) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return {};
  }

  try {
    const { gamertag, platform } = player;
    const { data: combatData } = await Warzone.combatHistory(
      gamertag,
      platform,
    );

    return combatData;
  } catch (error) {
    return {};
  }
};

/**
 * Get match stats from `player`; delimited by an optional `interval paramater.
 * @param {Player} player
 * @param {Interval} interval
 * @returns
 */
export const getHighlights = async (
  player: Player,
  interval: Interval,
): Promise<HighlightsResponse> => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return {};
  }

  try {
    const { gamertag, platform } = player;
    const { data: combatData } = await Warzone.combatHistoryWithDate(
      gamertag,
      interval.start as number,
      interval.end as number,
      platform,
    );

    const result = combatData.matches.reduce((acc, match) => {
      const { mostKills, highestKD } = acc;
      const { kills, kdRatio } = match.playerStats;

      return {
        mostKills: !mostKills || mostKills < kills ? kills : mostKills,
        highestKD: !highestKD || highestKD < kdRatio ? kdRatio : highestKD,
      };
    }, {});
    return { mostKills: result.mostKills, highestKD: result.highestKD };
  } catch (error) {
    return {};
  }
};
