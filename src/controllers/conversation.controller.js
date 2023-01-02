const { validationResult } = require("express-validator");
const { responseHandler, asyncHandler } = require("../helpers");
const { usersService } = require("../services");
const sendMail = require("./mailSender.controller");
const Client = require("../models/client.model");
const Lawyer = require("../models/lawyer.model");

const Conversation = require("../models/massagePool.model");
const jwt = require("jsonwebtoken");
const Post = require("../models/posts.model");
const User = require("../models/users.model");

const {
  ACTIVATION_TOKEN_SECRET,
  CLIENT_URL,
  REFRESH_TOKEN_SECRET,
} = require("../config/key");

(exports.activateChat = async (req, res) => {
  try {
    const activation_token = req.body.token;

    const chat = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET);

    console.log(chat);

    const { clientId, lawyerName, clientName, lawyerId, postId } = chat;

    const conver = new Conversation({
      clientId: clientId,
      lawyerId: lawyerId,
      postId: postId,
      clientName: clientName,
      lawyerName: lawyerName,
    });
    const verify = await conver.save();
    res.status(200).json({
      msg: "Conversation Created",
      conver: verify.id,
    });
    // res.json({ msg: "Account has been activated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
}),

(exports.conversationCreate = asyncHandler(async (req, res) => {
    try {
      const questionId = req.body.id;
      const token = req.body.token;
      const lawyerId = req.body.id1;
      const data = req.body.appointmentBody;
      console.log(token);

      const user = jwt.verify(
        token,
        "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
      );
    
      const client = await Client.findOne({ email: user.email });
      const lawyer = await Lawyer.findById(lawyerId);

      const requestCreate = {
        clientId: client.id,
        lawyerName: lawyer.userName,
        clientName: client.userName,
        lawyerId: lawyer.id,
        postId: questionId,
      };
      // console.log(lawyer)
      const activation_token = createActivationToken(requestCreate);
      const url = `${CLIENT_URL}chat-request/activation/${activation_token}`;
      sendMail(
        lawyer.email,
        url,
        `Appointemnt request from ${data.name} ${client.email} at ${data.time}`
      );
      res.json({ msg: "Chat Request Send" });

      console.log(activation_token);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
}));

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

exports.conversationCheck = asyncHandler(async (req, res) => {
  try {
    // const token = req.header("authentication");
    // console.log(token)
    const body = req.headers.body;
    const token = req.headers.token;
    const id2 = req.headers.id2;

    const user = jwt.verify(
      token,
      "#^j?4RyY!U3cMPU=x~^GGVQuf#J&p1xKcJmRz*sU8J!C#ENtJq"
    );
    console.log("akjshh", token);

    if (user.userType === "lawyer") {
      const data = await Lawyer.findOne({ email: user.email });
      const conver = await Conversation.findOne({
        postId: body,
        lawyerId: data.id,
        clientId: id2,
      });
      if (!conver) return res.status(200).json({ msg: "not created" });
      res.status(200).json(conver);
    } else {
      const data = await Client.findOne({ email: user.email });
      const conver = await Conversation.findOne({
        postId: body,
        clientId: data.id,
        lawyerId: id2,
      });
      console.log(body, data.id, id2);
      if (!conver) return res.status(200).json({ msg: "not created" });
      res.status(200).json(conver);
    }
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
      const data = await Lawyer.findOne({ email: user.email });
      const conver = await Conversation.findById(body);

      if (!conver) return res.status(2001).json({ msg: "not created" });
      res.status(200).json(conver);
    } else {
      const data = await Client.findOne({ email: user.email });
      const conver = await Conversation.findById(body);

      if (!conver) return res.status(200).json({ msg: "not created" });
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
    console.log(client.id);

    const conver = await Conversation.findById(body);
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
    // const client = await Client.findById(post.userId);
    const lawyer = await Lawyer.findOne({ email: user.email });
    const conver = await Conversation.findById(body);

    console.log(lawyer);
    const verify = await conver.updateOne({
      $push: { lawyerMessager: msg },
    });
    await conver.save();
    res.status(200).json({ message: "Conversation Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

const createActivationToken = (payload) => {
  return jwt.sign(payload, ACTIVATION_TOKEN_SECRET, {
    expiresIn: "10d",
  });
};
