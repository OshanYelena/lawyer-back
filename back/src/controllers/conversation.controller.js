const { validationResult } = require("express-validator");
const { responseHandler, asyncHandler } = require("../helpers");
const { usersService } = require("../services");
const User = require("../models/users.model");
const Client = require("../models/client.model");
const Lawyer = require("../models/lawyer.model");
const Post = require("../models/posts.model");
const Conversation = require("../models/massagePool.model");
const jwt = require("jsonwebtoken");
const e = require("express");

exports.conversationCreate = asyncHandler(async (req, res) => {
  try {
    // const token = req.header("authentication");
    // console.log(token)
    const body = req.body.id;
    const token = req.body.token;
    const user = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );
    const client = await Client.findOne({ email: user.email });

    const conversation = await Conversation.findOne({
      clientId: client.id,
      lawyerId: body,
    });
    if (conversation) throw Error("Conversation Exist");

    const conver = new Conversation({
      clientId: client.id,
      lawyerId: body,
    });
    await conver.save();
    res.status(200).json({ message: "Conversation Created" });
  } catch (err) {
    if (err.message === "Conversation Exist") return res.send(200);
    return res.status(500).json({ msg: err.message });
  }
});

exports.conversationAccept = asyncHandler(async (req, res) => {
  try {
    const { status, id } = req.body;
    const conver = await Conversation.findById(id);

    const verify = await conver.updateOne({ conversationStatus: status });
    await conver.save();
    res.status(200).json({ message: "Conversation Status Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.conversationGet = asyncHandler(async (req, res) => {
  try {
    // const token = req.header("authentication");
    // console.log(token)
    const body = req.headers.id;
    const token = req.headers.token;
    const user = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );  
    if (user.userType === "lawyer") {
    const  data = await Lawyer.findOne({ email: user.email });
      const conver = await Conversation.findOne({
          clientId: data.id,
        lawyerId: body,
      });

      res.status(200).json(conver);
    } else {
        const  data = await Client.findOne({ email: user.email });
      const conver = await Conversation.findOne({
        clientId: data.id,
        lawyerId: body,
      });


      res.status(200).json(conver);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.clientConversation = asyncHandler(async (req, res) => {
  try {
    const msg = req.body.formData;
    const body = req.body.id;
    const token = req.body.token;
    const user = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );

    const client = await Client.findOne({ email: user.email });

    const conver = await Conversation.findOne({
      clientId: client.id,
      lawyerId: body,
    });
    const verify = await conver.updateOne({
      $push: { clientMessager: msg },
    });
    await conver.save();
    res.status(200).json({ message: "Conversation Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

exports.lawyerConversation = asyncHandler(async (req, res) => {
  try {
    const msg = req.body.formData;
    const body = req.body.id;
    const token = req.body.token;
    const user = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );

    const client = await Client.findOne({ email: user.email });

    const conver = await Conversation.findOne({
      clientId: client.id,
      lawyerId: body,
    });

    const verify = await conver.update({
      $push: { lawyerMessager: msg },
    });
    await conver.save();
    res.status(200).json({ message: "Conversation Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});
