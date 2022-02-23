const fs = require("fs");

fs.readFile("./check/currentIds.json", (err, data) => {
  if (!err && data) {
    const currentIds = JSON.parse(data);
    let duplicateIds = [];
    //Find duplicate playerIds in currentIds
    for (let i = 0; i < currentIds.length; i++) {
      const currentId = currentIds[i]["playerId"];
      if (currentIds.indexOf(currentId) > -1) {
        duplicateIds.push(currentId);
      }
    }

    console.log(duplicateIds.length);
  }
});
