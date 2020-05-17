const router = require("express").Router();
let Poll = require("../models/poll.model");

router.route("/").get((req, res) => {
  Poll.find(function (err, polls) {
    if (err) {
      console.log(err);
    } else {
      res.json(polls);
    }
  }).catch((err) => console.log(err));
});

router.route("/new").post((req, res) => {
  const poll = new Poll(req.body);

  poll
    .save()
    .then((poll) => {
      res
        .status(200)
        .json({ addedPoll: poll, message: "Task added succesfully." });
    })
    .catch((err) => {
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
        error: err,
      });
  }).catch((err) => console.log(err));
});

router.route("/:id/vote").post(function (req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    let voterInfo = req.body.voterInfo;
    let choiceText = req.body.choiceText;
    let ip = voterInfo.ip;

    if (!poll) res.status(400).send({ message: err });
    else {
      let votersChoice = poll.pollChoices.find(
        (poll) => poll.choiceText === choiceText
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
          .then((poll) => {
            res
              .status(200)
              .json({ message: "Vote added succesfully!", vote: votersChoice });
          })
          .catch((err) =>
            res
              .status(400)
              .json({ message: "Vote could not be added.", message: err })
          );
      }
    }
  }).catch((err) => console.log(err));
});

function getTopThree(array) {
  let duplicatesRemoved = Array.from(new Set(array));
  let results = {};
  let resultsArray = [];
  let total = array.length;
  results["total"] = total;

  array.forEach((itemObj) => {
    if (!results[itemObj]) results[itemObj] = 1;
    if (results[itemObj]) results[itemObj] += 1;
  });

  for (let i = 0; i < duplicatesRemoved.length; i++) {
    if (results[duplicatesRemoved[i]]) {
      let percentage = (results[duplicatesRemoved[i]] / total) * 100;
      if (percentage > 100) percentage / 2;

      let obj = {
        key: duplicatesRemoved[i],
        percentage: percentage.toFixed(2),
        votes: results[duplicatesRemoved[i]],
      };

      resultsArray.push(obj);
    }
  }

  return resultsArray;
}

router.route("/:id/results").get(function (req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if (err) res.json(err);

    let pollChoices = poll.pollChoices;
    let pollResults = [];

    pollChoices.forEach((pollObj) => {
      let votes = pollObj.choiceVotes;
      let locations = [];
      let ages = [];
      let politicalParties = [];
      let incomeBracket = [];

      votes.forEach((poll) => {
        locations.push(poll.voterLocation);
        ages.push(poll.voterAge);
        politicalParties.push(poll.voterPoliticalParty);
        if (poll.incomeBracket) incomeBracket.push(poll.incomeBracket);
      });

      let topLocations = getTopThree(locations);
      let topAges = getTopThree(ages);
      let topPoliticalParties = getTopThree(politicalParties);
      let topIncomeBrackets = getTopThree(incomeBracket);

      let choiceResults = {
        total: votes.length,
        choice: pollObj.choiceText,
        locations: topLocations,
        ages: topAges,
        politicalParties: topPoliticalParties,
        incomeBracket: topIncomeBrackets,
      };

      pollResults.push(choiceResults);
    });

    res.json({
      pollResults: pollResults,
    });
  });
});

module.exports = router;
