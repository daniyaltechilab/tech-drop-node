
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dropcubeshistorySchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  dropId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Drop',
  },
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Token',
  }, 
  Bid:{
    type: Number,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  claimFunds:{
    type: Boolean,
    required: true
  },
  claimNft:{
    type: Boolean,
    required: true
  },
  withdraw:{
    type: Boolean,
    required: true
  },

})

var dropcubeshistoryModel = mongoose.model('Dropcubeshistory', dropcubeshistorySchema);
module.exports = dropcubeshistoryModel;

