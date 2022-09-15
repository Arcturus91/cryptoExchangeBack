const { Schema, model } = require("mongoose");

const transactionSellSchema = new Schema(
  {
    _user: {type:Schema.Types.ObjectId, ref:'User'},
    typeTransaction: String,
    cryptoName: {
      type: String,
      minLength: 1,
      trim: true,
      required: true,
      uppercase:true
    },
    cryptoSellAmount: {
      type: Number,
      required: true,
    },

    cryptoSellPrice: {
      type: Number,
      
    },
    _user: { type: Schema.Types.ObjectId, ref: "User" },

},
{
  // this second object adds extra properties: `createdAt` and `updatedAt`
  timestamps: true,
}
);

const TransactionSell = model("TransactionSell", transactionSellSchema);

module.exports = TransactionSell;