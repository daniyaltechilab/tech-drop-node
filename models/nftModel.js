
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const nftSchema = new Schema({

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin',
  },
  nftId: {
    type: Number,
    unique: true
  },
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  type:{
    type: String,
    enum: ["Mastercraft","Common", "Rare", "Epic", "Legendary", "Uncommon"],
    required: true,
  },
  artwork:{
    type: String,
    required: true
  },
  ImageArtistName:{
    type: String,
    required: true
  },
  ImageArtistProfile:{
    type: String,
    required: true
  },
  ImageArtistWebsite:{
    type: String,
    required: true
  },
  ImageArtistAbout:{
    type: String,
    required: true
  },
  ProducerName:{
    type: String,
    required: true
  },
  ProducerProfile:{
    type: String,
    required: true
  },
  ProducerInspiration:{
    type: String,
    required: true
  },
  ExecutiveProducerName:{
    type: String,
    required: true
  },
  ExecutiveProducerProfile:{
    type: String,
    required: true
  },
  ExecutiveProducerInspiration:{
    type: String,
    required: true
  },
  FanName:{
    type: String,
    required: true
  },
  FanProfile:{
    type: String,
    required: true
  },
  FanInspiration:{
    type: String,
    required: true
  },
  other:{
    type: String,
    required: true
  },
  tokensupply:{
    type: Number,
    required: true
  },
  tokensupplyalternative:{
    type: Number,
    required: true
  },
  supplytype:{
    type: String,
    enum: ["Single", "Variable"],
    required: true
  }
})

var NftModel = mongoose.model('NFT', nftSchema);
module.exports = NftModel;

