const mongoose = require("mongoose");
const Finances = require("../models/Finances.model");
const CryptoInventory = require("../models/CryptoInventory.model");

exports.addCash = (req, res, next) => {
  const { cash } = req.body;
console.log("yo soy cash server", )
const cashToAdd = Number(cash)
  Finances.findOne()
    .then((found) => {
      if (found) {
        const idLocator = found._id;
        const newCash = found.cash + cashToAdd;
        Finances.findByIdAndUpdate(
          idLocator,
          { cash: newCash },
          { new: true }
        ).then(() => {
          res.status(200).json({ successMessage: "Cash was added." });
        });
      } else {
        Finances.create({ cash:cashToAdd }).then(() => {
          res
            .status(200)
            .json({ successMessage: "Cash initial deposit was successful" });
        });
      }
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.getAssets = (req, res, next) => {
  Finances.find()
    .then((finances) => {
      CryptoInventory.find().then((totalInventory) => {
        res.status(200).json({ finances, totalInventory });
      });
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};
