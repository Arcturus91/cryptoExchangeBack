const app = require("../app");
const server = require("http").createServer(app);
const router = require("express").Router();
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const binance = require("../config/binance.config");


router.get("/spotPriceBTC", (req, res, next) => {
  binance
    .prices()
    .then((ticker) => {
      const btcPrice = ticker.BTCUSDT;
      res.status(200).json({ btcPrice });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

router.get("/spotPriceETH", (req, res, next) => {
  binance
    .prices()
    .then((ticker) => {
      const ethPrice = ticker.ETHUSDT;
      res.status(200).json({ ethPrice });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
});

module.exports = router;
