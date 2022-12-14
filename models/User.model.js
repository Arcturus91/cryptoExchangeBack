const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      trim: true,
      required: [true, "Email is required"],
      lowercase:true
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    firstName: {
      type: String,
      minLength: 1,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      minLength: 1,
      trim: true,
    required: true
    },
    imageUrl:  {
      type: String,
      default: "https://res.cloudinary.com/dad5dandd/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1664030626/AlpacaExchange/alpacaUserId2_km8k9e.png"
    },
    bankAccount:{
      type:Number,
      match: [/^(\d{14,14})$/g, "Please use only numbers."]
    },
    walletBTCAddress:{
      type:String,
    },
    walletETHAddress:{
      type:String,
    },
  _userBuys: [{type:Schema.Types.ObjectId, ref:'TransactionBuy'}],
  _userSells: [{type:Schema.Types.ObjectId, ref:'TransactionSell'}],
  receipts:[{type:Object}],
  _comments: [{type:Schema.Types.ObjectId, ref:'Comment'}],
  _posts: [{type:Schema.Types.ObjectId, ref:'Post'}],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
