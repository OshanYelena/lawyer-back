const { validationResult } = require("express-validator");
const { responseHandler, asyncHandler } = require("../helpers");
const { usersService } = require("../services");
const Users = require("../models/users.model");
const Lawyer = require("../models/lawyer.model");
const Client = require("../models/client.model");

const jwt = require("jsonwebtoken");

exports.loadUser = asyncHandler(async (req, res) => {
  try {
    await usersService.loadUser(req.user.id, (err, data) => {
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

exports.login = asyncHandler(async (req, res) => {
  try {
    // Login the user
    const { email, password } = req.body;
    let data;
    const user = await Users.findOne({ email: email });
    if (user.userType === "lawyer") {
      data = await Lawyer.findOne({ email: email });
    } else if (user.userType === "client") {
      data = await Client.findOne({ email: email });
    }
    const token = jwt.sign(
      { email: email, userType: user.userType },
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq",
      { expiresIn: "7d" }
    );
    return res.status(200).json({ message: "Login Success", token: token, role: user.userType });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({msg: err.message});
  }
});
