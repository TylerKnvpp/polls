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
  Poll.findById(id, (err, poll) => {
    if (poll) res.json(poll);
    else
      res.status(400).send({ message: "Poll could not be found.", error: err });
  });
});

router.route("/:id/vote").post(function(req, res) {
  Poll.findById(req.params.id, function(err, poll) {
    // let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    let voterInfo = req.body.voterInfo;
    if (!poll) res.status(400).send({ message: err });
    else {
      let votersChoice = poll.pollChoices.find(
        poll => poll.choiceText === req.body.choiceText
      );
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
    //     todo
    //       .save()
    //       .then(todo => {
    //         res.json("Task Updated!");
    //       })
    //       .catch(err => {
    //         res.status(400).send("Cannot update task");
    //       });
  });
});

module.exports = router;
