
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const seasonSchema = new Schema({

  dropId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'Drop',
  },
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  }
})

var seasonModel = mongoose.model('Season', seasonSchema);
module.exports = seasonModel;

