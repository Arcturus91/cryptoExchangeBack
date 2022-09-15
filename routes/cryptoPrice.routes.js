const router = require("express").Router();
const mongoose = require("mongoose");
const binance = require("../config/binance.config");


router.get("/websocketETH", (req, res, next) => {
  
  binance.websockets.candlesticks(['ETHUSDT'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.info(symbol+" "+interval+" candlestick update");
    console.info("close: "+close);
  

    res.json({closingPrice:close})
  }); 

});

router.get("/websocketBTC", (req, res, next) => {
  
  binance.websockets.candlesticks(['BTCUSDT'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.info(symbol+" "+interval+" candlestick update");
    console.info("close: "+close);

    res.json({closingPrice:close})
  }); 

});

router.get('/closeWebSocket',(req, res, next)=>{
    let log = false
    let endpoints = binance.websockets.subscriptions();
  for (let endpoint in endpoints) {
    if (log) console.log('Terminated ws endpoint: ' + endpoint);
    binance.websockets.terminate(endpoint);
  }
  res.status(200).json("web socket closed")
})


router.get("/spotPriceBTC",(req, res, next)=>{
    binance.prices()
    .then(ticker=> {
     
        const btcPrice = ticker.BTCUSDT
        res.status(200).json({ btcPrice });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
})

router.get("/spotPriceETH",(req, res, next)=>{
    binance.prices()
    .then(ticker=> {
       
        const ethPrice = ticker.ETHUSDT
        res.status(200).json({ ethPrice });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
})



module.exports = router;