const fs = require("fs");

fs.readFile("ids.json", (err, data) => {
  if (!err && data) {
    const arr1 = JSON.parse(data);

    fs.readFile("ids1.json", (err, data) => {
      if (!err && data) {
        const arr2 = JSON.parse(data);
        const mergedArr = arr1.concat(arr2);
        const set = new Set(mergedArr);

        console.log(
          `removed ${mergedArr.length - set.size} items, ${set.size} remaining`
        );

        fs.createWriteStream("07_ids.json").write(
          JSON.stringify(Array.from(set))
        );
      }
    });
  }
});
