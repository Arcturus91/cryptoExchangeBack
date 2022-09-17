const User = require("../models/User.model");
const mongoose = require("mongoose");
const TransactionBuy = require("../models/TransactionBuy.model");
const CryptoInventory = require("../models/CryptoInventory.model");
const Finances = require("../models/Finances.model");
const { clearCryptoRes } = require("../utils/utils");
const binance = require("../config/binance.config");

//will only execute this when creating a new crypto
exports.createCrypto = (req, res, next) => {
  const { coinQuantity } = req.body;
  const cryptoName = req.body.cryptoName.toUpperCase()
  const cryptoBuyAmount = coinQuantity;

  const { _id } = req.user;

 CryptoInventory.findOne({ cryptoName })
  .then((found) => {
    if (found)
      return res
        .status(400)
        .json({ errorMessage: "Esta cripto ya fue creada" });

  return binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoBuyPrice = ticker[cryptoPair];
      const coinPrice = cryptoBuyPrice;

      Finances.findOne().then((financeModel) => {
        if (financeModel.cash < coinQuantity * cryptoBuyPrice) {
          return res.status(400).json({
            errorMessage:
              "No hay suficiente cash en las cuentas para esta compra.",
          });
        }
        const newCash = financeModel.cash - coinQuantity * cryptoBuyPrice;
        const idLocator = financeModel._id;
        Finances.findByIdAndUpdate(
          idLocator,
          { cash: newCash },
          { new: true }
        ).then(() => {
          TransactionBuy.create({
            _user: _id,
            cryptoName,
            cryptoBuyAmount,
            cryptoBuyPrice,
          }).then((newTransaction) => {
            User.findByIdAndUpdate(_id, {
              $push: { _userBuys: newTransaction._id },
            }).then(() => {
              CryptoInventory.create({
                cryptoName,
                coinQuantity,
                coinPrice,
              }).then((crypto) => {
                const newCrypto = clearCryptoRes(crypto.toObject());
                res.status(200).json({ newCrypto });
              });
            });
          });
        });
      });
    })})
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//admin checking  crypto inventory
exports.checkInventory = (req, res, next) => {
  CryptoInventory.find()
    .then((totalInventory) => {
      res.status(200).json({ totalInventory });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//admin buying inventory
exports.buyInventory = (req, res, next) => {
  const {  cryptoBuyAmount } = req.body;
  const cryptoName = req.body.cryptoName.toUpperCase()
  const { _id } = req.user;
const cryptoBuyAmountNumber = Number(cryptoBuyAmount)
  binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoBuyPrice = ticker[cryptoPair];

      CryptoInventory.findOne({ cryptoName }).then((cryptoFound) => {
        if (!cryptoFound) {
          return res.status(400).json({
            errorMessage: "Aún no se ha registrado esta Cripto. Porfavor, solo compra criptomonedas ya registradas",
          });
        }

        Finances.findOne().then((financeModel) => {
          if (financeModel.cash < cryptoBuyAmountNumber * cryptoBuyPrice) {
            return res.status(400).json({
              errorMessage:
                "No hay suficiente cash en las cuentas para esta compra.",
            });
          }
          const newCash = financeModel.cash - cryptoBuyAmountNumber * cryptoBuyPrice;
          const idLocator = financeModel._id;
          Finances.findByIdAndUpdate(
            idLocator,
            { cash: newCash },
            { new: true }
          ).then(() => {
            TransactionBuy.create({
              _user: _id,
              cryptoName,
              cryptoBuyAmount,
              cryptoBuyPrice,
            }).then((newTransaction) => {
              User.findByIdAndUpdate(
                _id,
                {
                  $push: { _userBuys: newTransaction._id },
                },
                { new: true }
              ).then(() => {
                const newCryptoAmount =
                  cryptoFound.coinQuantity + cryptoBuyAmountNumber;

                const newCryptoInvPrice =
                  (cryptoFound.coinPrice * cryptoFound.coinQuantity +
                    cryptoBuyPrice * cryptoBuyAmountNumber) /
                  newCryptoAmount;
                CryptoInventory.findOneAndUpdate(
                  { cryptoName },
                  {
                    coinQuantity: newCryptoAmount,
                    coinPrice: newCryptoInvPrice,
                  },
                  { new: true }
                ).then((crypto) => {
                  const newCrypto = clearCryptoRes(crypto.toObject());
                  res.status(200).json({ newCrypto });
                });
              });
            });
          });
        });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};
