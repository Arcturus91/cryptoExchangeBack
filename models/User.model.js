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
      default: "https://res.cloudinary.com/dhgfid3ej/image/upload/v1558806705/asdsadsa_iysw1l.jpg"
    },
    bankAccount:{
      type:Number,
      match: [/^(\d{14,14})$/g, "Please use only numbers."]
      //este no funciona: match: [/^-?\d*\.?\d*$/, "Please use only numbers."],

      //maybe walletAddress should be a model because you need at least 1 different for BTC and another one for ETH.
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
