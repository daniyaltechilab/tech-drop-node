var express = require("express");
var assetRouter = express.Router();

const auth = require("../middlewares/auth");
const passport = require("passport");
const verifyUser = passport.authenticate("jwt", {
  session: false,
});

const UserModel = require("../models/UserModel");
const dropModel = require("../models/dropModel");
const TokenModel = require("../models/tokenModel");
const adminclaimfundsModel = require("../models/adminclaimfunds");

assetRouter
  .route("/claimfunds")
  .post(auth.verifyToken, verifyUser, async function (req, res, next) {
    try {
      var result = await UserModel.findOne({
        username: req.user.username,
      });
      console.log("result : ", result);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: "user dont exist against this username",
        });
      }

      if (!req.body.dropId) {
        return res.status(400).json({
          success: false,
          message: "dropId not found in request body",
        });
      }

      if (!req.body.tokenId) {
        return res.status(400).json({
          success: false,
          message: "tokenId not found in request body",
        });
      }

      if (!req.body.address) {
        return res.status(400).json({
          success: false,
          message: "address not found in request body",
        });
      }

      var dropresult = await dropModel.findOne({ _id: req.body.dropId });

      if (!dropresult) {
        return res.status(400).json({
          success: false,
          message: "There's no drop exists against this dropId",
        });
      }

      var tokenresult = await TokenModel.findOne({ _id: req.body.tokenId });

      if (!tokenresult) {
        return res.status(400).json({
          success: false,
          message: "There's no cube exists against this cubeId",
        });
      }

      var newadminrecord = new adminclaimfundsModel({
        tokenId: req.body.tokenId,
        dropId: req.body.dropId,
        address: req.body.address,
        claimFunds: true,
      });

      await adminclaimfundsModel.create(newadminrecord);

      tokenresult.adminclaimfunds = true;
      await tokenresult.save();

      return res.status(200).json({
        success: true,
        message: req.body.address + " funds successfully claimed !",
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

assetRouter.route("/getclaimfunds/").post(async function (req, res, next) {
  try {
    if (!req.body.dropId) {
      return res.status(400).json({
        success: false,
        message: "dropId not found in request body",
      });
    }

    if (!req.body.tokenId) {
      return res.status(400).json({
        success: false,
        message: "tokenId not found in request body",
      });
    }

    if (!req.body.address) {
      return res.status(400).json({
        success: false,
        message: "address not found in request body",
      });
    }

    var adminclaimfundsresult = await adminclaimfundsModel.findOne({
      dropId: req.body.dropId,
      tokenId: req.body.tokenId,
      address: req.body.address,
    });
    console.log("adminclaimfundsresult = ", adminclaimfundsresult);

    return res.status(200).json({
      success: true,
      Adminclaimfundsresult: adminclaimfundsresult,
    });
  } catch (error) {
    console.log("error (try-catch) : " + error);
    return res.status(500).json({
      success: false,
      err: error,
    });
  }
});

module.exports = assetRouter;
