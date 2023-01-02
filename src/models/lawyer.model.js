const mongoose = require("mongoose");


const userSchema =  mongoose.Schema({

  userName :{
    type : String
  },
  email: {
    type: String,
    unique: true
  },
  rating: String,
  degree: String,
  qualification: String,
  address: String,  

});


module.exports = mongoose.model('lawyer', userSchema);