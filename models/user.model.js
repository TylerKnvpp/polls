const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      minLength: 3
    },
    name: {
      type: String,
      unique: true,
      trim: true,
      minLength: 3
    },
    password: {
      type: String,
      unique: true,
      trim: true,
      minLength: 3
    },
    pollsVotedOn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
