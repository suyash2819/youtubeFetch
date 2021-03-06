const mongoose = require("mongoose");

const videos_schema = mongoose.Schema({
  ID: {
    type: Object,
    required: true,
  },
  snippet: {
    type: Object,
    required: true,
  },
});

const Videos = mongoose.model("Videos", videos_schema);
module.exports = Videos;
