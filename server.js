const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const offlineURL = "mongodb://127.0.0.1:27017/polls";
const localDB = "polls";
const MongoClient = require("mongodb").MongoClient;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Cluster has been connected");
});

connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

connection.catch();

// mongoose.connect(offlineURL, { useNewUrlParser: true });

// const db = mongoose.connection;
// db.once("open", (_) => {
//   console.log("Database connected:", offlineURL);
// });

// db.on("error", (err) => {
//   console.error("connection error:", err);
// });

const pollsRouter = require("./routes/polls");
app.use("/polls", pollsRouter);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
