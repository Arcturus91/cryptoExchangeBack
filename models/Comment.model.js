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

//nota como commen requiere el id del user, entonces jalas con ref el user.

const Comment = model("Comment", commentSchema);

module.exports = Comment;
