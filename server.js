const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const router = require("express").Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Cluster has been connected");
});

connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

connection.catch();

router.route("/").get((req, res) => {
  res.send(console.log("hello"));
});

const pollsRouter = require("./routes/polls");
app.use("/polls", pollsRouter);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
