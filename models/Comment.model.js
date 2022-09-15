const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    _author: { type: Schema.Types.ObjectId, ref: "User" },
    comment: String,
    _post : {type: Schema.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true
  }
);


const Comment = model("Comment", commentSchema);

module.exports = Comment;
