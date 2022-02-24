const fs = require("fs");

let allPlayers = [];

fs.promises.readdir("./output").then((files) => {
  console.log(`Found ${files.length} files`);

  for (const file of files) {
    fs.readFile(`./output/${file}`, (err, data) => {
      if (!err && data) {
        const arr = JSON.parse(data);
        const adjustedArr = arr.map((player) => ({
          playerName: player.playerName,
          playerId: player.playerId,
          playerImg: player.playerImg,
          history: player.history.map((history) => ({
            teamId: `${history.teamId}-${history.season}`,
            teamName: history.teamName,
            teamImg: history.teamImg,
          })),
        }));

        allPlayers.push(...adjustedArr);
      }

      const allPlayersSet = new Set(allPlayers);
      console.log(`Found ${allPlayersSet.size} unique players`);

      fs.writeFileSync(
        "./output/allPlayers.json",
        JSON.stringify(Array.from(allPlayersSet))
      );
    });
  }
});
