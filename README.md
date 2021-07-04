# Fantasy F1 Optimiser

A tool to help you explore different team combinations possible within your F1 Fantasy budget and preferences

This is a work in progress. Right now you can define your budget preferences in `generateAvailableOptions()`. From there you can run 2 functions:

`getBestTeamFromLatestRace(budgetFilteredTeam)`: gives you the combination with the highest possible result without turbo driver, within your budget.

`getBestTeamForUpcomingRace(budgetFilteredTeam)`: gives you the combination with the highest average points across all races in the season so far, within your budget.

This isn't elegant at all and there's many ways to refactor and abstract this code. Feel free to submit/suggest improvements.
