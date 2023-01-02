const { validationResult } = require('express-validator');
const { responseHandler, asyncHandler } = require('../helpers');
const { postsService } = require('../services');
const Posts = require('../models/posts.model');


exports.getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find();
    return res.status(200).json(posts)
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(true, 500, 'Server Error', null));
  }
});

// exports.getTagPosts = asyncHandler(async (req, res) => {
//   const tagName = req.params.tagname;

//   try {
//     await postsService.retrieveAllTag(
//       tagName,
//       (err, data) => {
//         if (err) {
//           console.log(err);
//           return res.status(err.code).json(err);
//         }
//         return res.status(data.code).json(data);
//       },
//     );
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(500)
//       .json(responseHandler(true, 500, 'Server Error', null));
//   }
// });

exports.getSinglePost = asyncHandler(async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    return res.status(200).json(post)
    // await postsService.retrieveOne(req.params.id, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(err.code).json(err);
    //   }
    //   return res.status(data.code).json(data);
    // });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.addPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(responseHandler(false, 400, errors.array()[0].msg, null));
  }
  try {
    const post = Posts({
      title: req.body.title,
      body: req.body.body,
      // userId: req.user.id,
      tagName: req.body.tagname,
    });
    // Save Post in the database
    const verify =  await post.save();

    if(verify.title === req.body.title) {
      return  res.status(200).send({message: "Post Created"})
    } else {
      return res.status(500).json({message: "error"});
    }
    // await postsService.create(post, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(err.code).json(err);
    //   }
    //   return res.status(data.code).json(data);
    // });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.deletePost = asyncHandler(async (req, res) => {
  try {
    await postsService.remove(req.params.id, (err, data) => {
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
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});
