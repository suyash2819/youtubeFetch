const API_KEY = process.env.API_KEY;
var express = require("express");
var axios = require("axios");
const mongoose = require("mongoose");
router = express.Router();
const count = 500;
var url =
  "https://www.googleapis.com/youtube/v3/search?key=" +
  API_KEY +
  "&maxResults=" +
  count +
  "&part=snippet&type=video";

const Videos = require("../schema/videoSchema.js");
const dburl = "mongodb://localhost:27017/youtube";

const connect = mongoose.connect(dburl);
connect.then(() => {
  console.log("connected correctly to server");
});

const saveData = (data) => {
  data.data.items.map((vid) => {
    var video = new Videos();
    video.ID = vid.id;
    video.snippet = vid.snippet;
    video.save().then(() => {
      console.log("saved");
    });
  });
};

const callApiAgain = (url) => {
  axios
    .get(url)
    .then((data) => {
      saveData(data);
      if (data.data.nextPageToken) {
        url =
          "https://www.googleapis.com/youtube/v3/search?key=" +
          API_KEY +
          "&maxResults=" +
          count +
          "&pageToken=" +
          data.data.nextPageToken +
          "&part=snippet&type=video";
        callApiAgain(url);
      } else {
        console.log(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

router.get("/fetch_video", (req, res) => {
  axios
    .get(url)
    .then((data) => {
      saveData(data);
      if (data.data.nextPageToken) {
        url =
          "https://www.googleapis.com/youtube/v3/search?key=" +
          API_KEY +
          "&maxResults=" +
          count +
          "&pageToken=" +
          data.data.nextPageToken +
          "&part=snippet&type=video";
        callApiAgain(url);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  console.log(new RegExp(req.body.input));

  console.log(req.body);
  Videos.find({
    "snippet.title": new RegExp(req.body.input),
  }).then((data) => {
    res.send(data);
  });
});
module.exports = router;
