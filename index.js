require('lodash.combinations');
const fetch = require('node-fetch');
let _ = require('lodash');

let drivers = [];
let constructors = [];

let teamCombinations = [];

function getPlayers() {
  drivers = [];
  constructors = [];
  fetch('https://fantasy-api.formula1.com/partner_games/f1/players')
    .then((res) => res.json())
    .then((res) => {
      res.players.forEach((player) => {
        player.is_constructor
          ? constructors.push({
              name: player.display_name,
              price: player.price,
              season_points: player.season_score,
              average_points: player.season_score / player.season_prices.length,
            })
          : drivers.push({
              name: player.display_name,
              price: player.price,
              season_points: player.season_score,
              average_points: player.season_score / player.season_prices.length,
            });
      });
    })
    .finally(() => generateTeam());
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
  team.forEach((player) => {
    totalPrice = totalPrice + player.price;
    teamAvg = teamAvg + player.average_points;
  });

  const priceToPointsRatio = parseFloat(teamAvg / totalPrice).toFixed(2);

  const teamCombo = {
    teamPrice: parseFloat(totalPrice.toFixed(2)),
    teamAvg: parseFloat(teamAvg.toFixed(2)),
    priceToPointsRatio: parseFloat(priceToPointsRatio),
    team,
  };
  teamCombinations.push(teamCombo);
}

function generateAvailableOptions() {
  const myBudgetUpper = 102.2;
  const myBudgetLower = 90;
  let budgetFilteredTeam = [];
  let driver1Filter = [];
  let constructorFilter = [];

  // BUDGET FILTER
  teamCombinations.filter((team) => {
    if (team.teamPrice >= myBudgetLower && team.teamPrice <= myBudgetUpper) {
      budgetFilteredTeam.push(team);
    }
  });

  // POINTS FILTER
  budgetFilteredTeam.filter((teamCombo) => {
    if (teamCombo.teamAvg > 170) {
      console.log(teamCombo);
    }
  });

  // // DRIVER 1 FILTER
  // budgetFilteredTeam.forEach((teamCombo) => {
  //   teamCombo.team.filter((player) => {
  //     player.name === 'M. Verstappen' ? driver1Filter.push(teamCombo) : null;
  //   });
  // });

  // // CONSTRUCTOR FILTER
  // driver1Filter.forEach((teamCombo) => {
  //   teamCombo.team.filter((player) => {
  //     player.name === 'Red Bull' ? constructorFilter.push(teamCombo) : null;
  //   });
  // });

  // console.log(constructorFilter.length);
  // constructorFilter.forEach((option) => {
  //   console.log(option);
  // });
}

getPlayers();
