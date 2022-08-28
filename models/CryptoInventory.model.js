const { Schema, model } = require("mongoose");

const cryptoInventorySchema = new Schema(
  {
    cryptoName: {
      type: String,
      minLength: 1,
      trim: true,
      required: true,
    },
    coinQuantity: {
      type: Number,
      required: true,
    },
coinPrice:{ //acquisition price per coin in USD
  type: Number,
  required: true,
},
  },
  {
    timestamps: true,
  }
);

const CryptoInventory = model("CryptoInventory", cryptoInventorySchema );

module.exports = CryptoInventory;
