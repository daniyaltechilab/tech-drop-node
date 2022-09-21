
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminclaimfundsSchema = new Schema({

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

var adminclaimfundsModel = mongoose.model('adminclaimfunds', adminclaimfundsSchema);
module.exports = adminclaimfundsModel;

