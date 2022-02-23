const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const writeStream = fs.createWriteStream("ids.json");

const baseUrl = "https://sofifa.com/players?r=070002&set=true&offset=";
const startOffset = 0;
const endOffset = 10925;

const ids = [];
const promises = [];

for (let i = startOffset; i <= endOffset; i += 60) {
  console.log(`Offset: ${i}`);

  promises.push(
    axios(`${baseUrl}${i}`)
      .then((response) => {
        if (response.data) {
          const html = response.data;
          const $ = cheerio.load(html);
          const table = $("tbody.list").children();

          table.each((i, el) => {
            const url = $(".col-name > a", el).attr("href");

            if (url) ids.push(url.toString().split("/")[2]);
          });
        }
      })
      .catch((err) => {
        let error;

        if (err.response) {
          error = err.response.status;
        } else if (err.request) {
          error = "Redirected";
        } else {
          error = err.message;
        }

        console.log(`${i}: ${error}`);
      })
  );
}

Promise.all(promises).then((responses) => {
  try {
    writeStream.write(JSON.stringify(ids));
  } catch (err) {
    console.warn(err);
  }
});
