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


const Post = model("Post", postSchema);

module.exports = Post;
