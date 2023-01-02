const mongoose = require("mongoose");


const userSchema =  mongoose.Schema({

  userName :{
    type : String
  },
  email: {
    type: String,
    unique: true
  },

  address: String,  

});


module.exports = mongoose.model('client', userSchema);