const mongoose = require("mongoose");

const resetPasswordSchema = mongoose.Schema({
  userEmail: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  //expire: moment.utc().add(config.tokenExpiry, 'seconds')
});

ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);
module.exports = ResetPassword;
