const mongoose = require("mongoose");


const userSchema =  mongoose.Schema({
  clientId :{
    type : String
  },
  requestMassage: String,
  lawyerId:{ 
    type:String
  },
  postId:String,
  lawyerName:String,
  clientName:String,
  conversationStatus: Boolean,
  clientMessager: [],
  lawyerMessager: [],

});


module.exports = mongoose.model('conversation', userSchema);