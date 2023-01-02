const { validationResult } = require("express-validator");
const { responseHandler, asyncHandler } = require("../helpers");
const { answersService } = require("../services");
const Posts = require("../models/posts.model");

const Answer = (answer) => ({
  body: answer.body,
  userId: answer.userId,
  postId: answer.postId,
});

exports.getAnswers = asyncHandler(async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post);
    res.status(200).json(post.answer);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, "Server Error", null));
  }
});

exports.addAnswer = asyncHandler(async (req, res) => {
  try {
    const { formBody, userId, postId, userName } = req.body;

    const data = { lawyerId: userId, answer: formBody, userName: userName };

    const post = await Posts.findById(postId);
    const update = await post.updateOne({
      $push: { "answer":  data },
    });
    res.status(200).json({ msg: "answer added" });

    // Save Answer in the database
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.deleteAnswer = asyncHandler(async (req, res) => {
  try {
    await answersService.remove(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code).json(err);
      }
      return res.status(data.code).json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, "Server Error", null));
  }
});
