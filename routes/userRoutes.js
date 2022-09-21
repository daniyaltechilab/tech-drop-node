var express = require('express');
var router = express.Router();

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt')
const { BCRYPT_SALT_ROUNDS } = require("../config/bcrypt");
const jwtUtil = require("../utils/jwt");

const forgotPasswordModule = require('../actions/sendForgotPasswordEmail');
const forgotPasswordModel = require("../models/forgotPasswordModel");



router.post('/forgotPassword', async function (req, res, next) {

  try {

      if (!req.body.email)
        return res.status(200).json({ success: false, message: "email not found in the body" });

      var user = await UserModel.findOne({ email: req.body.email });

      if(!user)
        return res.status(200).json({ success: false, message: "Incorrect Email" });

      await forgotPasswordModel.deleteMany({userEmail: req.body.email});
              
      let mailSent = await forgotPasswordModule.sendResetPasswordPin(req.body.email);
      if (!mailSent)
        return res.send(
          "User created, but Unable to send verification email, try later"
      );

      res.status(200).json({ success: true,  message: "Reset Password email sent" });

  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({ success: false, err: error });
  }

});


//verify reset password pin
router.post("/verifyResetPasswordPin", async (req, res, next) => {
  try {

    if (!req.body.email)
      return res.status(200).json({ success: false, message: "email not found in the body" });

    if (!req.body.pin)
      return res.status(200).json({ success: false, message: "pin not found in the body" });

    var result = await forgotPasswordModel.findOne({userEmail: req.body.email, resetPasswordToken: req.body.pin, });

    if (!result)  
      return res.status(200).json({ success: false, message: "wrong pin entered" });

    result.verified = true;
    result.save();
    // await forgotPasswordModel.deleteMany({userEmail: req.body.email, resetPasswordToken: req.body.pin});

    return res.status(200).json({ success: true, message: "Correct Pin entered" });

  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});


//verify reset password pin
router.post("/resetPassword", async (req, res, next) => {
  try {

    if (!req.body.password)
      return res.status(400).json({ success: false, message: "password not found in the body" });

    if (!req.body.email)
      return res.status(400).json({ success: false, message: "email not found in the body" });
    
    var result = await forgotPasswordModel.findOne({userEmail: req.body.email});

    if (!result || !result.verified)  
      return res.status(200).json({ success: false, message: "pin not verified yet" });
      

    var user = await UserModel.findOne({ email: req.body.email });
    user.password = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
    await user.save();

    await forgotPasswordModel.deleteMany({userEmail: req.body.email});

    return res.status(200).json({ success: true, message: "Password successfully changed" });

  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});



module.exports = router;
