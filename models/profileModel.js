
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({

  Name:{
    type: String,
    required: true
  },
  Profile:{
    type: String,
    required: true
  },
  Website:{
    type: String
  },
  About:{
    type: String
  },
  Inspiration:{
    type: String
  },
  role:
  {
        type: String,
        enum: ["Image Artist","Music Artist","Producer","Executive Producer","Fan"],
        required: true
  },

})

var profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel;

