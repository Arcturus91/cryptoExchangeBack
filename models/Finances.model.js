const { Schema, model } = require("mongoose");

const financesSchema = new Schema(
  {
    cash:Number
  },
  {
    timestamps: true,
  }
);

const Finances = model("Finances", financesSchema );

module.exports = Finances;
