
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const collectionSchema = new Schema({

  nftId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'NFT',
  },
  collectiontitle:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  }

})

var collectionModel = mongoose.model('Collection', collectionSchema);
module.exports = collectionModel;

