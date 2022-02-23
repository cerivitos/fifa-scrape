const fs = require("fs");

let currentIds = [];

fs.promises.readdir("./final").then((files) => {
  console.log(`Found ${files.length} files`);

  for (const file of files) {
    fs.readFile(`./final/${file}`, (err, data) => {
      if (!err && data) {
        const arr = JSON.parse(data);
        const idsToInt = arr.map((player) => parseInt(player["playerId"]));
        console.log(`${idsToInt.length} ids in ${file}`);
        currentIds.push(...idsToInt);
      }

      currentIds.sort((a, b) => a - b);

      fs.writeFileSync("./check/currentIds.json", JSON.stringify(currentIds));
    });
  }
});
