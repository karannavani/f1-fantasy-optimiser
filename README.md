# Fantasy F1 Optimiser
A tool to help you explore different team combinations possible within your F1 Fantasy budget and preferences

This is a work in progress. Right now you can define your budget preferences in `generateAvailableOptions()`. From there you can generate deeper filtered teams by generating arrays for new levels of filters:

```
  budgetFilteredTeam.forEach((teamCombo) => {
    teamCombo.team.filter((player) => {
      player.name === 'M. Verstappen' ? driver1Filter.push(teamCombo) : null;
    });
  });
```

This isn't elegant at all and there's many ways to refactor and abstract this code, but this just an evening's work. Feel free to submit/suggest improvements.
