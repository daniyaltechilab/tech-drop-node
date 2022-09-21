const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const transactionSchema = new Schema({

  tokenId: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  transaction: {
    type: String,
    required: true
  }
  
})

var transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;0

