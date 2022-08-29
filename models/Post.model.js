const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    _author: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    _comments : [{type: Schema.Types.ObjectId, ref: "Comment" }],
    likes:Number,
  },
  {
    timestamps: true
  }
);

//nota como commen requiere el id del user, entonces jalas con ref el user.

const Post = model("Post", postSchema);

module.exports = Post;
