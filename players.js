const axios = require("axios");
const axiosRetry = require("axios-retry");
const cheerio = require("cheerio");
const fs = require("fs");

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
const startIndex = 6001;
const maxTry = 7050;

const baseUrl = "https://sofifa.com/player/";

fs.readFile("check/missingIds.json", (err, data) => {
  if (!err && data) {
    const allIds = JSON.parse(data);

    const players = [];
    const errors = [];

    let promises = [];

    for (let i = startIndex; i <= maxTry; i++) {
      const id = allIds[i];

      promises.push(
        axios(`${baseUrl}${id}`)
          .then((response) => {
            try {
              const html = response.data;
              const $ = cheerio.load(html);
              const name = $(".info > h1").text();
              const img = $(".bp3-card.player > img").attr("data-src");
              const historyTable = $(
                ".card.double-spacing > table > tbody"
              ).children();

              let history = [];
              historyTable.each((i, el) => {
                const season = $("td", el).first().text();
                const teamId = $("td > a", el).attr("href").split("/")[2];
                const teamName = $("td > a", el).first().text().trimStart();
                const teamImg = $("td > a > figure > img", el).attr("data-src");

                const historyObj = {
                  season: season,
                  teamId: teamId,
                  teamName: teamName,
                  teamImg: teamImg,
                };

                history.push(historyObj);
              });

              const result = {
                playerName: name,
                playerId: id,
                playerImg: img,
                history: history,
              };

              players.push(result);
              console.log(`Found ${players.length} players`);
            } catch (err) {
              console.log(`${id}: Player does not exist`);

              errors.push({
                playerId: id,
                error: "Player does not exist",
              });
            }
          })
          .catch((err) => {
            let error;

            if (err.request) {
              const redirectedUrl = err.request?._currentUrl.toString();

              if (redirectedUrl) {
                promises.push(
                  axios(redirectedUrl)
                    .then((response) => {
                      try {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        const name = $(".info > h1").text();
                        const img = $(".bp3-card.player > img").attr(
                          "data-src"
                        );
                        const historyTable = $(
                          ".card.double-spacing > table > tbody"
                        ).children();

                        let history = [];
                        historyTable.each((i, el) => {
                          const season = $("td", el).first().text();
                          const teamId = $("td > a", el)
                            .attr("href")
                            .split("/")[2];
                          const teamName = $("td > a", el)
                            .first()
                            .text()
                            .trimStart();
                          const teamImg = $("td > a > figure > img", el).attr(
                            "data-src"
                          );

                          const historyObj = {
                            season: season,
                            teamId: teamId,
                            teamName: teamName,
                            teamImg: teamImg,
                          };

                          history.push(historyObj);
                        });

                        const result = {
                          playerName: name,
                          playerId: id,
                          playerImg: img,
                          history: history,
                        };

                        players.push(result);
                        console.log(`Found ${players.length} players`);
                      } catch (err) {
                        console.log(`${id}: Player does not exist`);

                        errors.push({
                          playerId: id,
                          error: "Player does not exist",
                        });
                      }
                    })
                    .catch((err) => {
                      if (err.code === "ECONNRESET") {
                        error = "Connection reset by server";
                      } else if (err.request) {
                        error = `Tried to redirect to ${err.request._currentUrl.toString()}`;
                      } else if (err.response) {
                        error = err.response.status;
                      } else {
                        error = "Unknown error";
                      }
                    })
                );
              } else {
                error = `Tried to redirect to ${redirectedUrl}`;
              }
            } else if (err.response) {
              error = err.response.status;
            } else if (err.code === "ECONNRESET") {
              error = "Connection reset by server";
            } else {
              error = "Unknown error";
            }

            if (error) {
              console.log(`${id}: ${error}`);

              errors.push({
                playerId: id,
                error: error,
              });
            }
          })
      );
    }

    Promise.all(promises)
      .then((responses) => {
        console.log("All promises resolved");
        try {
          const subsetLength = 1000;
          const subsets = Math.ceil(players.length / subsetLength);

          for (let i = 0; i < subsets; i++) {
            console.log(`Writing ${i + 1} of ${subsets}`);

            const subsetStart = i * subsetLength;
            const subsetEnd = subsetStart + subsetLength;

            const playersSubset = players.slice(
              subsetStart,
              subsetEnd > players.length ? players.length : subsetEnd
            );

            const writeStream = fs.createWriteStream(
              `output/missing_${startIndex + subsetStart}-${
                startIndex + subsetStart + playersSubset.length - 1
              }.json`
            );

            writeStream.write(JSON.stringify(playersSubset));
          }

          console.log(
            `Found ${players.length}/${maxTry - startIndex + 1} players`
          );
        } catch (err) {
          console.warn(err);
        }
      })
      .catch((err) => {
        console.warn(err);

        try {
          const subsetLength = 1000;
          const subsets = Math.ceil(players.length / subsetLength);

          for (let i = 0; i < subsets; i++) {
            const subsetStart = i * subsetLength;
            const subsetEnd = subsetStart + subsetLength;

            const playersSubset = players.slice(
              subsetStart,
              subsetEnd > players.length ? players.length : subsetEnd
            );

            const writeStream = fs.createWriteStream(
              `check/missing_${startIndex + subsetStart}-${
                startIndex + subsetStart + playersSubset.length - 1
              }.json`
            );

            writeStream.write(JSON.stringify(playersSubset));
          }

          console.log(
            `Found ${players.length}/${maxTry - startIndex + 1} players`
          );
        } catch (err) {
          console.warn(err);
        }
      });
  }
});
