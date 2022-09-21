const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  tokenId: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  SalePrice: {
    type: Number,
    required: true,
  },
  nftids: {
    type: [String],
    required: true,
  },
  ownermusicfile: {
    type: String,
    required: true,
  },
  nonownermusicfile: {
    type: String,
    required: true,
  },
  MusicArtistName: {
    type: String,
    required: true,
  },
  MusicArtistProfile: {
    type: String,
    required: true,
  },
  MusicArtistAbout: {
    type: String,
    required: true,
  },
  check: {
    type: String,
    required: true,
  },
  adminclaimfunds: {
    type: Boolean,
    required: true,
  },
  userclaimfunds: {
    type: Boolean,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  salestatus: {
    type: Boolean,
    required: true,
  },
});

var TokenModel = mongoose.model("Token", tokenSchema);
module.exports = TokenModel;
