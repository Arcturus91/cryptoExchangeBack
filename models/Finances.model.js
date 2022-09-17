const { Schema, model } = require("mongoose");

const financesSchema = new Schema(
  {
    cash:{
      type:Number,
      min:[0,'not enough cash']
    },
    profits:{
      type:Number,
      default: 0
    },
/*     profitPercent:{
      type:Number,
      default: 1
    } */
  },
  {
    timestamps: true,
  }
);

const Finances = model("Finances", financesSchema );

module.exports = Finances;
