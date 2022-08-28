const { Schema, model } = require("mongoose");

const financesSchema = new Schema(
  {
    cash:Number,
    typeBusiness: String,
  },
  {
    timestamps: true,
  }
);

const Finances = model("Finances", financesSchema );

module.exports = Finances;
