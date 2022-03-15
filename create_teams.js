const fs = require("fs");

let allTeams = [];

fs.promises.readdir("./output").then((files) => {
  console.log(`Found ${files.length} files`);

  for (const file of files) {
    fs.readFile(`./output/${file}`, (err, data) => {
      if (!err && data) {
        const arr = JSON.parse(data);

        arr.forEach((player) => {
          const teams = player["history"];
          teams.forEach((team) => {
            const teamWithoutSeason = {
              teamId: team["teamId"],
              teamName: team["teamName"],
              teamImg: team["teamImg"],
            };

            let teamExists = false;
            allTeams.forEach((team) => {
              if (team.teamId === teamWithoutSeason.teamId) {
                teamExists = true;
              }
            });

            if (!teamExists) allTeams.push(teamWithoutSeason);
          });
        });
      }

      console.log(`Found ${allTeams.length} unique teams`);

      fs.writeFileSync(
        "./final/allTeams.json",
        JSON.stringify(Array.from(allTeams))
      );
    });
  }
});
