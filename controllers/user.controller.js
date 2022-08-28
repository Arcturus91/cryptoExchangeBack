const User = require("../models/User.model");
const mongoose = require("mongoose");
const TransactionBuy = require("../models/TransactionBuy.model");
const TransactionSell = require("../models/TransactionSell.model");
const CyrptoInventory = require("../models/CryptoInventory.model");
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
      User.findByIdAndUpdate(_id, {
        $push: { _userBuys: newTransaction._id },
      }).then((user) => {
        const newUser = clearRes(user.toObject());
        res.status(200).json({ user: newUser });
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
        const newUser = clearRes(user.toObject());
        res.status(200).json({ user: newUser });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};


//Tanto el buy como el sell del user modifican el inventario.

//cuando te estés quedando sin inventario, retira la cripto de la posibildiad de comprarse



