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
  const { _id, walletETHAddress, walletBTCAddress } = req.user;

  if (!walletBTCAddress && !walletETHAddress) {
    return res
      .status(400)
      .json({ errorMessage: "Porfavor agrega una dirección cripto." });
  }

  switch (cryptoName) {
    case "BTC":
      if (!walletBTCAddress) {
        return res
          .status(400)
          .json({
            errorMessage:
              "Porfavor agrega una dirección cripto que admita BTC.",
          });
      }
      break;

    case "ETH":
      if (!walletETHAddress) {
        return res
          .status(400)
          .json({
            errorMessage:
              "Porfavor agrega una dirección cripto que admita ETH.",
          });
      }
      break;
      

  }

  binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoCompanyCost = ticker[cryptoPair];
      const cryptoBuyPrice = cryptoCompanyCost * (1 + profitMargin);
      const operationProfit =
        cryptoBuyAmount * cryptoCompanyCost * profitMargin;

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

            if (newCryptoAmount<0) {
              return res
                .status(400)
                .json({ errorMessage: "No hay sufiente de esta crypto moneda. Porfavor reduce el tamaño de tu orden." });
            }

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

  const regexBank = /^(\d{14,14})$/g;
  if (!regexBank.test(bankAccount)) {
    return res
      .status(400)
      .json({ error: "Tu cuenta bancaria debe tener 14 números." });
  }

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

exports.addBTCwallet = (req, res, next) => {
  const { walletBTCAddress } = req.body;
  const { _id } = req.user;

  const regexBTCwallet = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}/;
  if (!regexBTCwallet.test(walletBTCAddress)) {
    return res
      .status(400)
      .json({ error: "Dirección de billetera de BTC incorrecta." });
  }

  User.findByIdAndUpdate(_id, { walletBTCAddress }, { new: true })
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

exports.addETHwallet = (req, res, next) => {
  const { walletETHAddress } = req.body;
  const { _id } = req.user;

  const regexETHwallet = /^0x[a-fA-F0-9]{40}$/;
  if (!regexETHwallet.test(walletETHAddress)) {
    return res
      .status(400)
      .json({ error: "Dirección de billetera de ETH incorrecta." });
  }

  User.findByIdAndUpdate(_id, { walletETHAddress }, { new: true })
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

//cuando te estés quedando sin inventario, retira la cripto de la posibildiad de comprarse
//esto se puede hacer con validaciones del Schema
