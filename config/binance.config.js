const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_KEY,
  APISECRET: process.env.BINANCE_KEY_SECRET
});

module.exports = binance



  
/*   WEBSOCKETS PRICE
  binance.websockets.candlesticks(['ETHUSDT'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.info(symbol+" "+interval+" candlestick update");
    console.info("open: "+open);
    console.info("high: "+high);
    console.info("low: "+low);
    console.info("close: "+close);
    console.info("volume: "+volume);
    console.info("isFinal: "+isFinal);
  });  */



