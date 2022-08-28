const User = require("../models/User.model");
const mongoose = require("mongoose");
const TransactionBuy = require("../models/TransactionBuy.model");
const TransactionSell = require("../models/TransactionSell.model");
const CryptoInventory = require("../models/CryptoInventory.model");
const Finances = require("../models/Finances.model");
const { clearRes, createJWT } = require("../utils/utils");

exports.getLoggedUser = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

exports.buyCripto = (req, res, next) => {
  const { cryptoName, cryptoBuyAmount, cryptoBuyPrice } = req.body;
  const { _id } = req.user;

  TransactionBuy.create({
    _user: _id,
    cryptoName,
    cryptoBuyAmount,
    cryptoBuyPrice,
  })
    .then((newTransaction) => {
      User.findByIdAndUpdate(
        _id,
        {
          $push: { _userBuys: newTransaction._id },
        },
        { new: true }
      ).then((user) => {
        CryptoInventory.findOne({ cryptoName }).then((cryptoFound) => {
          //cryptoName, coinQuantity, coinPrice
          const newCryptoAmount = cryptoFound.coinQuantity - cryptoBuyAmount;
          // DANGER: inventory price doesnt change because its calculated with average price.
          CryptoInventory.findOneAndUpdate(
            { cryptoName },
            { coinQuantity: newCryptoAmount },
            { new: true }
          ).then(() => {
            Finances.findOne().then((financeFound) => {
              const newCash =
                financeFound.cash + cryptoBuyAmount * cryptoBuyPrice;
              const idLocator = financeFound._id;

              Finances.findByIdAndUpdate(idLocator, { cash: newCash },{ new: true }).then(
                () => {
                  const newUser = clearRes(user.toObject());
                  res.status(200).json({ user: newUser });
                }
              );
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

exports.sellCripto = (req, res, next) => {
  const { cryptoName, cryptoSellAmount, cryptoSellPrice } = req.body;
  const { _id } = req.user;

  TransactionSell.create({
    _user: _id,
    cryptoName,
    cryptoSellAmount,
    cryptoSellPrice,
  })
    .then((newTransaction) => {
      User.findByIdAndUpdate(_id, {
        $push: { _userSells: newTransaction._id },
      }).then((user) => {
        CryptoInventory.findOne({ cryptoName }).then((cryptoFound) => {
          //cryptoName, coinQuantity, coinPrice
          const newCryptoAmount = cryptoFound.coinQuantity + cryptoSellAmount;
          //DANGER: inventory price doesnt change because its calculated with average price.
          CryptoInventory.findOneAndUpdate(
            { cryptoName },
            { coinQuantity: newCryptoAmount },
            { new: true }
          ).then(() => {
            const newUser = clearRes(user.toObject());
            res.status(200).json({ user: newUser });
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

//cuando te estés quedando sin inventario, retira la cripto de la posibildiad de comprarse
