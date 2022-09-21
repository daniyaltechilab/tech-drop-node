const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dropSchema = new Schema({
  dropId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Token",
  },
  AuctionStartsAt: {
    type: String,
    required: true,
  },
  AuctionEndsAt: {
    type: String,
    required: true,
  },
  MinimumBid: {
    type: Number,
    required: true,
  },
  bidDelta: {
    type: Number,
    required: true,
  },
});

var dropModel = mongoose.model("Drop", dropSchema);
module.exports = dropModel;
