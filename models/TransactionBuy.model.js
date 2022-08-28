const { Schema, model } = require("mongoose");

const transactionBuySchema = new Schema(
  {
    typeTransaction: String,

    cryptoName: {
      type: String,
      minLength: 1,
      trim: true,
      required: true,
    },
    cryptoBuyAmount: {
      type: Number,
      required: true,
    },
    cryptoBuyPrice: {
      type: Number,
      required: true,
    },
    _user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const TransactionBuy = model("TransactionBuy", transactionBuySchema);

module.exports = TransactionBuy;
