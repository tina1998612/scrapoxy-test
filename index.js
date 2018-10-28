const _ = require("lodash"),
  cheerio = require("cheerio"),
  request = require("request"),
  winston = require("winston");

winston.level = "debug";

const config = {
  opts: {
    // URL of Scrapoxy
    proxy: "http://localhost:8888",
    url: "https://www.amazon.com/dp/B009PCI2JU",

    // HTTPS over HTTP
    tunnel: false
  }
};

setInterval(function() {
  request(config.opts, (err, res, body) => {
    if (err) {
      console.log(err);
    } else {
      const $ = cheerio.load(body);
      console.log($("#priceblock_ourprice").text());
    }
  });
}, 5000);
