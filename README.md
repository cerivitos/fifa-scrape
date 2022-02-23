# FIFA transfer history

## Data
This repo contains data scraped from [SoFIFA](https://sofifa.com) and all data belongs to their respective owners.

## What this is
The file `final/allPlayers.json` is a json file of all players to have appeared in FIFA07 - FIFA22 in the following data structure:
```
{
  playerName: string,
  playerId: number,
  playerImg: string,
  history: [
      teamId: string,
      teamName: string,
      teamImg: string
    ]
}
```
Note that `teamId` is a concatenation of the unique FIFA team ID and the season. Eg. If the player played for Celta Vigo in season 2008/2009, the `teamId` will be `450-2008/2009`.

Other files are just intermediate scraping files and node scripts.
