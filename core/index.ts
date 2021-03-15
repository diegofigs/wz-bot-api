import WzApiFactory from 'call-of-duty-api';
import { isWithinInterval } from 'date-fns';

export const API = WzApiFactory();

const CREDENTIALS = {
  username: process.env.WZ_USERNAME,
  password: process.env.WZ_PASSWORD,
};
const CAREER = { kills: undefined, wins: undefined, kdRatio: undefined };
const PLAYER_HIGHLIGHTS = { gamertag: undefined, mostKills: undefined, highestKD: undefined };

export const loginToCOD = async () => {
  try {
    if (CREDENTIALS.username && CREDENTIALS.password) {
      await API.login(CREDENTIALS.username, CREDENTIALS.password);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

function getMatchEndTime(match) {
  return new Date(match.utcEndSeconds * 1000);
}

function findMatchesInInterval(matches, interval) {
  if (interval) {
    return matches.filter((match) => isWithinInterval(getMatchEndTime(match), interval));
  }
  return matches;
}

const fetchPlayerHighlights = async (player, interval) => {
  try {
    const { gamertag, platform } = player;
    const { matches } = await API.MWcombatwz(gamertag, platform);
    const matchesWithinInterval = findMatchesInInterval(matches, interval);

    const highlights = matchesWithinInterval.reduce(
      (result, match) => {
        const { mostKills, highestKD } = result;
        const { kills, kdRatio } = match.playerStats;

        return {
          mostKills: !mostKills || mostKills < kills ? kills : mostKills,
          highestKD: !highestKD || highestKD < kdRatio ? kdRatio : highestKD,
        };
      },
      { ...PLAYER_HIGHLIGHTS },
    );
    return { gamertag, ...highlights };
  } catch (error) {
    return PLAYER_HIGHLIGHTS;
  }
};

/**
 * Get career stats from `player`.
 */
export const getCareer = async (player: { gamertag: string; platform: string; }) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return CAREER;
  }

  const { gamertag, platform } = player;
  const career = await API.MWBattleData(gamertag, platform);
  const { kills, wins, kdRatio } = career.br;

  return { kills, wins, kdRatio };
};

/**
 * Get match stats from `player`; delimited by an optional `interval` parameter.
 */
export const getPlayerHighlights = async (player, interval) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return PLAYER_HIGHLIGHTS;
  }

  // Fail gracefully if a player's stats can't be fetched / aggregated
  try {
    return await fetchPlayerHighlights(player, interval);
  } catch (error) {
    return PLAYER_HIGHLIGHTS;
  }
};
