const { validationResult } = require("express-validator");
const { responseHandler, asyncHandler } = require("../helpers");
const { usersService } = require("../services");
const User = require("../models/users.model");
const Client = require("../models/client.model");
const Lawyer = require("../models/lawyer.model");

const jwt = require("jsonwebtoken");

exports.getOneUser = asyncHandler(async (req, res) => {
  try {
    const token = req.header("Authentication");
    const { email, userType } = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );
    let data ;
    if (userType === "lawyer") {
      data = await Lawyer.findOne({ email: email });
    } else {
      data = await Client.findOne({ email: email });
    }
    res.status(200).json(data)
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, "Server Error", null));
  }
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    await usersService.retrieveAll((err, data) => {
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
      .json({ msg: err.message });
  }
});

exports.ClientRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Register user in the database

    const doesEmailExist = await User.findOne({ email });
if (doesEmailExist) {
   throw new Error("Email already exists"); 
}
    const user = new User({
      userName: username,
      email: email,
      password: password,
      userType: "client",
    });
    await user.save();

    const client = new Client({
      userName: username,
      email: email,
    });
    await client.save();
    const token = jwt.sign(
      { email: email, userType: "client" },
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq",
      { expiresIn: "7d" }
    );
    return res.status(200).json({ message: "userCreated", token: token, role: "client" });
  } catch (err) {

    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.LawyerRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {

    const doesEmailExist = await User.findOne({ email });
    if (doesEmailExist) {
       throw new Error("Email already exists"); 
    }

    // Register user in the database
    const user = new User({
      userName: username,
      email: email,
      password: password,
      userType: "lawyer",
    });
    await user.save();

    const lawyer = new Lawyer({
      userName: username,
      email: email,
    });
    await lawyer.save();
    const token = jwt.sign(
      { email: email, userType: "lawyer" },
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq",
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "userCreated", token: token, role: "lawyer" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
