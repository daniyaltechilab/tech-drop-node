
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const usercubeshistorySchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Auction',
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

var usercubeshistoryModel = mongoose.model('Usercubeshistory', usercubeshistorySchema);
module.exports = usercubeshistoryModel;

