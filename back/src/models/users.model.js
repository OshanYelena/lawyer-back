const mongoose = require("mongoose");


const userSchema =  mongoose.Schema({

  userName :{
    type : String
  },
  email:{ 
    type:String,
    unique: true
  },
  password: {
    type: String
  },
  userType: {
    type: String
  },

});


module.exports = mongoose.model('userLogs', userSchema);