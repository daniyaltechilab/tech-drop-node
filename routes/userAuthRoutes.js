var express = require("express");
var router = express.Router();

const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { BCRYPT_SALT_ROUNDS } = require("../config/bcrypt");
const jwtUtil = require("../utils/jwt");

const forgotPasswordModule = require("../actions/sendForgotPasswordEmail");

router.post("/login", async function (req, res, next) {
  try {
    if (!req.body.address)
      return res.status(400).json({
        success: false,
        message: "address not found in the body",
      });
    if (!req.body.network)
      return res.status(400).json({
        success: false,
        message: "network not found in the body",
      });
    if (req.body.network != "ropsten") {
      return res.status(400).json({
        success: false,
        message: "Change network to ropsten!",
      });
    }
    var userrole;
    userrole = "user";
    var user = await UserModel.findOne({
      network: req.body.network,
      address: req.body.address,
    });
    console.log("user : ", user);
    let payload;
    if (user) {
      payload = {
        address: user.address,
        network: user.network,
        roles: userrole,
        userId: user._id,
      };
      console.log("user already exists");
    } else {
      var newUser = new UserModel({
        address: req.body.address,
        network: req.body.network,
        roles: userrole,
      });
      await UserModel.create(newUser);
      payload = {
        address: req.body.address,
        network: req.body.network,
        roles: userrole,
        userId: newUser._id,
      };
    }
    console.log("new user created");
    let token = await jwtUtil.sign(payload);
    return res.status(200).json({
      success: true,
      token: token,
      message: "Successfully logged-in",
      roles: userrole,
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});

router.post("/signup", async function (req, res, next) {
  try {
    var userrole;
    userrole = "user";
    if (req.body.password != null) {
      if (req.body.password.length < 4) {
        res.status(400).send("Invalid password Entered");
        return;
      }
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        BCRYPT_SALT_ROUNDS
      );
      req.body.password = hashedPassword;
      var newuser = new UserModel({
        username: req.body.username,
        password: req.body.password,
        roles: userrole,
      });
      await UserModel.create(newuser);
      console.log("new user created");
    }
    return res.status(200).json({
      success: true,
      message: "User Successfully signup",
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    res.status(500).json({
      success: false,
      err: error,
    });
  }
});

router.post("/adminsignup", async function (req, res, next) {
  try {
    var userrole;
    userrole = "admin";
    if (req.body.password != null) {
      if (req.body.password.length < 4) {
        res.status(400).send("Invalid password Entered");
        return;
      }
      const hashedPassword = await bcrypt.hash(
        req.body.password,
        BCRYPT_SALT_ROUNDS
      );
      req.body.password = hashedPassword;
      var newadmin = new UserModel({
        username: req.body.username,
        password: req.body.password,
        roles: userrole,
      });
      await UserModel.create(newadmin);
      console.log("new admin created");
    }
    return res.status(200).json({
      success: true,
      message: "Admin Successfully signup",
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    res.status(500).json({
      success: false,
      err: error,
    });
  }
});
router.post("/adminlogin", async function (req, res, next) {
  try {
    var userrole;
    userrole = "admin";

    var user = await UserModel.findOne({
      username: req.body.username,
    });
    console.log("user : ", user);

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "user dont exist against this username",
      });
    }
    const validPassword = bcrypt.compareSync(req.body.password, user.password); // user password is stored as hashed
    if (!validPassword) {
      return res.status(400).json("Incorrect email or password entered");
    }

    let payload;
    payload = {
      username: req.body.username,
      roles: userrole,
      userId: user._id,
    };

    let token = await jwtUtil.sign(payload);

    return res.status(200).json({
      success: true,
      token: token,
      message: "Successfully logged-in",
      roles: userrole,
      AdminId: user._id,
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});

module.exports = router;
