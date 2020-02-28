const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get((req, res) => {
  Poll.find(function(err, polls) {
    if (err) {
      console.log(err);
    } else {
      res.json(polls);
    }
  });
});

router.route("/new").post((req, res) => {
  const poll = new Poll(req.body);

  poll
    .save()
    .then(poll => {
      res
        .status(200)
        .json({ addedPoll: poll, message: "Task added succesfully." });
    })
    .catch(err => {
      res.status(400).json({ message: "ERROR: Task could not be added." });
    });
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  Poll.findById(id, (err, poll) => {
    if (poll) res.json({ poll: poll, ip: ip });
    else
      res.status(400).send({
        message: "Poll could not be found.",
        error: err
      });
  });
});

router.route("/:id/vote").post(function(req, res) {
  Poll.findById(req.params.id, function(err, poll) {
    let voterInfo = req.body.voterInfo;
    if (!poll) res.status(400).send({ message: err });
    else {
      let votersChoice = poll.pollChoices.find(
        poll => poll.choiceText === req.body.choiceText
      );

      let validation = true;

      if (!voterInfo.voterName) {
        res.status(400).send({ message: "First Name is required." });
        validation = false;
      }

      if (!voterInfo.voterLocation) {
        res.status(400).send({ message: "Location is required." });
        validation = false;
      }

      if (!voterInfo.voterPoliticalParty) {
        res.status(400).send({ message: "Political Affiliation is required." });
        validation = false;
      }

      if (!voterInfo.voterAge) {
        res.status(400).send({ message: "Age is required." });
        validation = false;
      }

      if (!voterInfo.incomeBracket) {
        res.status(400).send({ message: "Income Bracket is required." });
        validation = false;
      }

      if (validation) {
        votersChoice.choiceVotes.push(voterInfo);

        poll
          .save()
          .then(poll => {
            res
              .status(200)
              .json({ message: "Vote added succesfully!", vote: votersChoice });
          })
          .catch(err =>
            res
              .status(400)
              .json({ message: "Vote could not be added.", message: err })
          );
      }
    }
  });
});

module.exports = router;
