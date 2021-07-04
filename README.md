# Fantasy F1 Optimiser

A tool to help you explore different team combinations possible within your F1 Fantasy budget and preferences

This is a work in progress. Right now you can define your budget preferences in `generateAvailableOptions()`. From there you can run 2 functions:

`getBestTeamFromLatestRace(budgetFilteredTeam)`: gives you the combination with the highest possible result without turbo driver, within your budget.

`getBestTeamForUpcomingRace(budgetFilteredTeam)`: gives you the combination with the highest average points within your budget, based on either:

- Average across all races in the season so far - use `teamCombo.teamAvg ` in the if statement
- Average across the 5 latest races - use `teamCombo.teamAvgPointsFromLastFive` in the if statement

This isn't elegant at all and there's many ways to refactor and abstract this code. Feel free to submit/suggest improvements.
