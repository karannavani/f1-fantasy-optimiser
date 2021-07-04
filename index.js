require('dotenv').config();
require('lodash.combinations');
const fetch = require('node-fetch');
let _ = require('lodash');

let drivers = [];
let constructors = [];

let teamCombinations = [];

function generateXF1CookieData() {
  return Buffer.from(
    // Base64 encode
    encodeURIComponent(
      // Encode%20URI
      JSON.stringify(
        // Stringify JSON object
        {
          data: {
            subscriptionToken: process.env.SUBSCRIPTION_TOKEN,
          },
        }
      )
    )
  ).toString('base64');
}

function getPlayers() {
  drivers = [];
  constructors = [];
  return fetch('https://fantasy-api.formula1.com/partner_games/f1/players')
    .then((res) => res.json())
    .then((res) => transformPlayers(res.players));
}

function transformPlayers(players) {
  drivers = [];
  constructors = [];
  players.forEach((player) => {
    if (player.is_constructor) {
      constructors.push({
        id: player.id,
        name: player.display_name,
        price: player.price,
        season_points: player.season_score,
        average_points: player.season_score / player.season_prices.length,
      });
    } else {
      drivers.push({
        id: player.id,
        name: player.display_name,
        price: player.price,
        season_points: player.season_score,
        average_points: player.season_score / player.season_prices.length,
      });
    }
  });

  getRaceStats();
}

async function getRaceStats() {
  for (let i = 0; i < drivers.length; i++) {
    if (drivers[i]) {
      const res = await fetch(
        `https://fantasy-api.formula1.com/partner_games/f1/players/${drivers[i].id}/game_periods_scores?player=${drivers[i].id}`,
        {
          headers: {
            'X-F1-Cookie-Data': generateXF1CookieData(),
          },
        }
      );
      const stats = await res.json();
      drivers[i].race_stats = transformRaceStats(stats.game_periods_scores);
      drivers[i].latest_result =
        drivers[i].race_stats[drivers[i].race_stats.length - 1].total_points;
    }
  }
  for (let i = 0; i < constructors.length; i++) {
    if (constructors[i]) {
      const res = await fetch(
        `https://fantasy-api.formula1.com/partner_games/f1/players/${constructors[i].id}/game_periods_scores?player=${constructors[i].id}`,
        {
          headers: {
            'X-F1-Cookie-Data': generateXF1CookieData(),
          },
        }
      );
      const stats = await res.json();
      constructors[i].race_stats = transformRaceStats(
        stats.game_periods_scores
      );
      constructors[i].latest_result =
        constructors[i].race_stats[
          constructors[i].race_stats.length - 1
        ].total_points;
    }
  }

  generateTeam();
}

function transformRaceStats(statsArr) {
  const raceStats = [];
  statsArr.forEach((race) => {
    const { short_name, total_points } = race;
    raceStats.push({
      short_name,
      total_points,
    });
  });
  return raceStats;
}

function generateTeam() {
  let combinations = _.combinations(drivers, 5);
  combinations.forEach((combination) => {
    constructors.forEach((constructor) => {
      const team = [...combination, constructor];
      generateTeamPriceAndPoints(team);
    });
  });

  generateAvailableOptions();
}

function generateTeamPriceAndPoints(team) {
  let totalPrice = 0;
  let teamAvg = 0;
  let teamLatestAvg = 0;
  team.forEach((player) => {
    totalPrice = totalPrice + player.price;
    teamAvg = teamAvg + player.average_points;
    teamLatestAvg = teamLatestAvg + player.latest_result;
  });

  const priceToPointsRatio = parseFloat(teamAvg / totalPrice).toFixed(2);

  const teamCombo = {
    teamPrice: parseFloat(totalPrice.toFixed(2)),
    teamAvg: parseFloat(teamAvg.toFixed(2)),
    teamLatestAvg: parseFloat(teamLatestAvg.toFixed(2)),
    priceToPointsRatio: parseFloat(priceToPointsRatio),
    team,
  };
  teamCombinations.push(teamCombo);
}

function generateAvailableOptions() {
  const myBudgetUpper = 102.2;
  const myBudgetLower = 98;
  let budgetFilteredTeam = [];
  let driver1Filter = [];
  let constructorFilter = [];

  // BUDGET FILTER
  teamCombinations.filter((team) => {
    if (team.teamPrice >= myBudgetLower && team.teamPrice <= myBudgetUpper) {
      budgetFilteredTeam.push(team);
    }
  });

  getBestTeamFromLatestRace(budgetFilteredTeam);
  getBestTeamForUpcomingRace(budgetFilteredTeam);
}

function getBestTeamFromLatestRace(budgetFilteredTeam) {
  budgetFilteredTeam.filter((teamCombo) => {
    if (teamCombo.teamLatestAvg >= 199) {
      console.log(teamCombo);
    }
  });
}

function getBestTeamForUpcomingRace(budgetFilteredTeam) {
  // POINTS FILTER
  budgetFilteredTeam.filter((teamCombo) => {
    if (teamCombo.teamAvg > 171) {
      console.log(teamCombo);
    }
  });
}

getPlayers();
