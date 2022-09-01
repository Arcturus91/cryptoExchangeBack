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
  const { _id } = req.user;
  binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoSpotPrice = ticker[cryptoPair];
      const cryptoBuyPrice = cryptoSpotPrice * (1 + profitMargin);
      const operationProfit = cryptoBuyAmount * cryptoSpotPrice * profitMargin;

      CryptoInventory.findOne({ cryptoName }).then((cryptoFound) => {
        if (!cryptoFound) {
          return res.status(400).json({
            errorMessage: "Aún no ofertamos esta cripto",
          });
        }
        if (cryptoFound.coinQuantity < cryptoBuyAmount) {
          return res
            .status(400)
            .json({
              errorMessage:
                "No tenemos esa cantidad de cripto. Intenta con un monto menor.",
            });
        }
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
            const newCryptoAmount = cryptoFound.coinQuantity - cryptoBuyAmount;
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
  const { cryptoName, cryptoSellAmount } = req.body;
  const { _id } = req.user;
  binance
    .prices()
    .then((ticker) => {
      const cryptoPair = cryptoName + "USDT";
      const cryptoSpotPrice = ticker[cryptoPair];

      const cryptoSellPrice = cryptoSpotPrice * (1 - profitMargin);

      const operationProfit = cryptoSellAmount * cryptoSpotPrice * profitMargin;
      CryptoInventory.findOne({ cryptoName }).then((cryptoFound) => {
        if (!cryptoFound) {
          return res.status(400).json({
            errorMessage: "Aún no negociamos con esta cripto.",
          });
        }
        
        Finances.findOne().then((financeFound) => {
        if (financeFound.cash < cryptoSellAmount * cryptoSellPrice) {
          return res
            .status(400)
            .json({
              errorMessage:
                "No tenemos esa cantidad de efectivo. Intenta vender menos cripto.",
            });
        }

        TransactionSell.create({
          _user: _id,
          cryptoName,
          cryptoSellAmount,
          cryptoSellPrice,
        }).then((newTransaction) => {
          User.findByIdAndUpdate(_id, {
            $push: { _userSells: newTransaction._id },
          },{ new: true }).then((user) => {
              //cryptoName, coinQuantity, coinPrice
              const newCryptoAmount =
                cryptoFound.coinQuantity + cryptoSellAmount;
              //DANGER: inventory price doesnt change because its calculated with average price.
              CryptoInventory.findOneAndUpdate(
                { cryptoName },
                { coinQuantity: newCryptoAmount },
                { new: true }
              ).then(() => {
                const newCash =
                  financeFound.cash - cryptoSellAmount * cryptoSellPrice;
                const idLocator = financeFound._id;
                const newProfits = financeFound.profits + operationProfit;
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
