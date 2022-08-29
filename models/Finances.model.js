const { Schema, model } = require("mongoose");

const financesSchema = new Schema(
  {
    cash:{
      type:Number,
      min:[0,'not enough cash']
    },
    typeBusiness: String,
  },
  {
    timestamps: true,
  }
);

const Finances = model("Finances", financesSchema );

module.exports = Finances;
