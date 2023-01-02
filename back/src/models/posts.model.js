const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  userId: {
    type: String,
  },

  answer: [
  ],
});

module.exports = mongoose.model("posts", postSchema);
