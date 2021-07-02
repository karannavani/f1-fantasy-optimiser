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
            })
          : drivers.push({ name: player.display_name, price: player.price });
      });
    })
    .finally(() => generateTeam());
}

function generateTeam() {
  let combinations = _.combinations(drivers, 5);
  combinations.forEach((combination) => {
    constructors.forEach((constructor) => {
      const team = [...combination, constructor];
      generateTeamPrice(team);
    });
  });

  generateAvailableOptions();
}

function generateTeamPrice(team) {
  let totalPrice = 0;
  team.forEach((teamElement) => {
    totalPrice = totalPrice + teamElement.price;
  });

  const teamCombo = { teamPrice: parseFloat(totalPrice.toFixed(2)), team };
  teamCombinations.push(teamCombo);
}

function generateAvailableOptions() {
  const myBudgetUpper = 102.2;
  const myBudgetLower = 102.2;
  let budgetFilteredTeam = [];
  let driver1Filter = [];
  let constructorFilter = [];

  // BUDGET FILTER
  teamCombinations.filter((team) => {
    if (team.teamPrice >= myBudgetLower && team.teamPrice <= myBudgetUpper) {
      budgetFilteredTeam.push(team);
    }
  });

  // DRIVER 1 FILTER
  budgetFilteredTeam.forEach((teamCombo) => {
    teamCombo.team.filter((player) => {
      player.name === 'M. Verstappen' ? driver1Filter.push(teamCombo) : null;
    });
  });

  // CONSTRUCTOR FILTER
  driver1Filter.forEach((teamCombo) => {
    teamCombo.team.filter((player) => {
      player.name === 'Red Bull' ? constructorFilter.push(teamCombo) : null;
    });
  });

  console.log(JSON.stringify(constructorFilter));
}

getPlayers();
