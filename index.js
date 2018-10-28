const _ = require("lodash"),
  cheerio = require("cheerio"),
  request = require("request"),
  winston = require("winston");
var randomstring = require("randomstring");
var tr = require("tor-request");
tr.TorControlPort.password = "giraffe";
tr.setTorAddress("localhost", 9050);
var PriceFinder = require('price-finder');
var priceFinder = new PriceFinder();
var fs = require('fs')


winston.level = "debug";

const config = {
  opts: {
    // URL of Scrapoxy
    proxy: "http://localhost:8888",
    url: "https://www.amazon.com/dp/B009PCI2JU",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, sdch, br",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    },

    // HTTPS over HTTP
    tunnel: false
  }
};

setInterval(function () {
  // config.opts.url = config.opts.url + "?refRID=" + randomstring.generate(20);
  tr.newTorSession(err => {
    requestIP();
    crawl();
    return;
  });

}, Math.floor(1000 + Math.random() * 9000));

function requestIP() {
  tr.request("https://api.ipify.org", function (err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log("Your public (through Tor) IP is: " + body);
    } else {
      console.log(err);
    }
  });
}

function crawl() {
  config.opts.url = config.opts.url + "?refRID=" + randomstring.generate(20);
  priceFinder.findItemPrice(config.opts.url, function (err, price) {
    if (!err && price != undefined) {
      fs.appendFile('amazon.csv', price + ", ", function (err) {
        if (err) throw err;
        console.log(price, 'Saved!');
      });
    } else console.log(err)
  });
}