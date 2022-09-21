const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  network: {
    type: String,
  },
  roles: [
    {
      type: String,
      enum: ["user", "admin"],
    },
  ],
});

var Users = mongoose.model("User", UserSchema);
module.exports = Users;
