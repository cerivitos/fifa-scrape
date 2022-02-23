const fs = require("fs");

let mergedIds = [];

for (let i = 7; i <= 22; i++) {
  let fileName =
    i >= 10 ? `player_ids/${i}_ids.json` : `player_ids/0${i}_ids.json`;

  fs.readFile(fileName, (err, data) => {
    if (!err && data) {
      const arr = JSON.parse(data);
      const idsToInt = arr.map((id) => parseInt(id));
      mergedIds = mergedIds.concat(idsToInt);
    }

    if (i === 22) {
      const uniqueIds = new Set(mergedIds);
      const uniqueIdsArr = Array.from(uniqueIds).sort((a, b) => a - b);
      fs.createWriteStream("player_ids/all_ids.json").write(
        JSON.stringify(Array.from(uniqueIdsArr))
      );
      console.log(`Merged ids, ${uniqueIdsArr.length} remaining`);
    }
  });
}
