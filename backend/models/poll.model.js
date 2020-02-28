var mongoose = require("mongoose");

var voteSchema = new mongoose.Schema({
  voterName: { type: String, required: false },
  voterLocation: { type: String, required: true },
  voterPoliticalParty: { type: String, required: true },
  voterAge: { type: String, required: true },
  incomeBracket: { type: String, required: false },
  ip: { type: String, required: true }
});

var choiceSchema = new mongoose.Schema({
  choiceText: String,
  choiceVotes: [voteSchema]
});

const PollSchema = new mongoose.Schema(
  {
    pollQuestion: { type: String, required: true },
    pollDescription: { type: String, required: false },
    pollChoices: [choiceSchema],
    pollUsersVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", PollSchema);
