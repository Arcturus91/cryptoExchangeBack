const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cryptoInvRoutes = require("./cryptoInv.routes");
const financesRoutes = require("./finances.routes");
const uploadRoutes = require("./upload.routes");
const binance = require("../config/binance.config");


router.get("/", (req, res, next) => {
  
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

    res.json({closingPrice:close})
  }); 

res.json({successMessage:"all great"})
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", cryptoInvRoutes);
router.use("/admin", financesRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
