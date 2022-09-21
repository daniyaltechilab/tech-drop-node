
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userclaimfundsSchema = new Schema({

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
  address:{
    type: String,
    required: true
  },
  claimFunds:{
    type: Boolean,
    required: true,
    default:false

  }

})

var userclaimfundsModel = mongoose.model('userclaimfunds', userclaimfundsSchema);
module.exports = userclaimfundsModel;

