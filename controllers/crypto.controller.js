const User = require("../models/User.model");
const mongoose = require("mongoose");
const TransactionBuy = require("../models/TransactionBuy.model");
const TransactionSell = require("../models/TransactionSell.model");
const CryptoInventory = require("../models/CryptoInventory.model");
const { clearRes, createJWT, clearCryptoRes } = require("../utils/utils");

//will only execute this when creating a new crypto
exports.createCrypto = (req, res, next) => {
  const { cryptoName, coinQuantity, coinPrice } = req.body;
  const cryptoBuyAmount = coinQuantity;
  const cryptoBuyPrice = coinPrice;
  console.log("yo soy crypto buy amount", cryptoBuyAmount);
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
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

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

exports.buyInventory = (req, res, next) => {
  const { cryptoName, cryptoBuyAmount, cryptoBuyPrice } = req.body;
  const { _id } = req.user;

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
      CryptoInventory.findOne(
       { cryptoName}
      ).then((cryptoFound) => {
const newCryptoAmount = cryptoFound.coinQuantity + cryptoBuyAmount;
const newCryptoInvPrice =
 (cryptoFound.coinPrice*cryptoFound.coinQuantity + cryptoBuyPrice*cryptoBuyAmount)/newCryptoAmount;

//cryptoName, coinQuantity, coinPrice

CryptoInventory.findOneAndUpdate({cryptoName},{coinQuantity:newCryptoAmount, coinPrice: newCryptoInvPrice},{new:true})
.then((crypto)=>{
        const newCrypto = clearCryptoRes(crypto.toObject());
        res.status(200).json({ newCrypto });
    })

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
