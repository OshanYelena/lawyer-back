const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  answeredEmail: {
    type: String,
  },
  questionId: String,
  answer: String,
});

module.exports = mongoose.model("answer", userSchema);
