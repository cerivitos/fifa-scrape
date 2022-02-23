const fs = require("fs");

fs.readFile("./check/currentIds.json", (err, data) => {
  if (!err && data) {
    const currentIds = JSON.parse(data);
    fs.readFile("./player_ids/all_ids.json", (err, data) => {
      if (!err && data) {
        const allIds = JSON.parse(data);

        const missingIds = [];

        for (const allId of allIds) {
          if (!currentIds.includes(allId)) {
            missingIds.push(allId);
          }
        }

        fs.writeFile(
          "./check/missingIds.json",
          JSON.stringify(missingIds),
          (err) => {
            console.log(`Found ${missingIds.length} missing ids`);
          }
        );
      }
    });
  }
});
