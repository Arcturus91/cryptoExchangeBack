const mongoose = require("mongoose");
const Finances = require("../models/Finances.model");
const CryptoInventory = require("../models/CryptoInventory.model");

exports.addCash = (req, res, next) => {
  const { cash } = req.body;

  Finances.create({ cash })
    .then(() => {
      res.status(200).json({ successMessage: "Cash deposit was successful" });
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
    .then((finances)=>{
        CryptoInventory.find()
        .then((totalInventory) => {
          res.status(200).json({ finances,totalInventory });
        })

    })
    
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      return res.status(500).json({ errorMessage: error.message });
    });





};
