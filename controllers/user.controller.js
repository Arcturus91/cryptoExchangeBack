const User = require("../models/User.model");
const mongoose = require("mongoose");
const TransactionBuy = require("../models/TransactionBuy.model");
const TransactionSell = require("../models/TransactionSell.model");
const CryptoInventory = require("../models/CryptoInventory.model");
const Finances = require("../models/Finances.model");
const binance = require("../config/binance.config");
const { clearRes, createJWT } = require("../utils/utils");
const profitMargin = 0.01;

exports.getLoggedUser = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

exports.buyCripto = (req, res, next) => {
  const { cryptoName, cryptoBuyAmount } = req.body;
  //removing cryptoBuyPrice for making it come from binance API
  const { _id } = req.user;

  binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoCompanyCost = ticker[cryptoPair];
      const cryptoBuyPrice = cryptoCompanyCost * (1 + profitMargin);
      const operationProfit =
        cryptoBuyAmount * cryptoCompanyCost * profitMargin;
      console.log(operationProfit);
      //cryptoBuyPrice * CyrptoBuyAmount is what user pays.
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
                const newProfits = financeFound.profits + operationProfit;
                const idLocator = financeFound._id;
                Finances.findByIdAndUpdate(
                  idLocator,
                  { cash: newCash, profits: newProfits },
                  { new: true }
                ).then(() => {
                  const newUser = clearRes(user.toObject());
                  res.status(200).json({ user: newUser });
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

//user sell crypto => company cash reduces.
exports.sellCripto = (req, res, next) => {
  const { cryptoName, cryptoSellAmount, cryptoSellPrice } = req.body;
  const { _id } = req.user;
  //aqui podría ser el middleware check sobre enough cash.
  //runValidators: true,
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
            Finances.findOne().then((financeFound) => {
              const newCash =
                financeFound.cash - cryptoSellAmount * cryptoSellPrice;
              const idLocator = financeFound._id;
              Finances.findByIdAndUpdate(
                idLocator,
                { cash: newCash },
                { new: true }
              ).then(() => {
                const newUser = clearRes(user.toObject());
                res.status(200).json({ user: newUser });
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

//BANK ROUTES: i know i should create a separte model for them but lack of time.

exports.createBankAccount = (req, res, next) => {
  const { bankAccount } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { bankAccount }, { new: true })
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.deleteBankAccount = (req, res, next) => {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { bankAccount: null }, { new: true })
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.editBankAccount = (req, res, next) => {
  const { bankAccount } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { bankAccount }, { new: true })
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

//WalletAddress routes:





//cuando te estés quedando sin inventario, retira la cripto de la posibildiad de comprarse
//esto se puede hacer con validaciones del Schema
