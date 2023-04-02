const app = require("../app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  binance.websockets.candlesticks(["BTCUSDT"], "1m", (candlesticks) => {
    let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
    let { c: close, i: interval } = ticks;
    console.info("close: " + close);
    io.emit("btcPrice", { symbol: symbol, price: close });
  });

  binance.websockets.candlesticks(["ETHUSDT"], "1m", (candlesticks) => {
    let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
    let { c: close, i: interval } = ticks;
    console.info("close: " + close);
    io.emit("ethPrice", { symbol: symbol, price: close });
  });
});

module.exports = server;
