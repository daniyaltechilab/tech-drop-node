var express = require("express");
var assetRouter = express.Router();

const auth = require("../middlewares/auth");
const passport = require("passport");
const verifyUser = passport.authenticate("jwt", { session: false });

const transactionModel = require("../models/transactionModel");

assetRouter
  .route("/tokenTransaction/:start/:end")
  .get(async function (req, res, next) {
    try {
      if (!req.params.start) {
        return res.status(400).json({
          success: false,
          message: "start not found in the params",
        });
      }

      if (!req.params.end) {
        return res.status(400).json({
          success: false,
          message: "end not found in the params",
        });
      }

      var result1 = await transactionModel.find({}).select("-__v -_id");

      if (result1.length == 0)
        return res
          .status(400)
          .json({ success: false, message: "No transaction found" });

      var result=result1.reverse();

      var paginationresult = result.slice(req.params.start, req.params.end);

      return res
        .status(200)
        .json({
          success: true,
          transactions: paginationresult,
          transactionscount: result.length,
        });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({ success: false, err: error });
    }
  });

assetRouter
  .route("/tokenTransaction")
  .get( async function (req, res, next) {
    try {

      var result = await transactionModel.find({}).select("-__v -_id");

      if (result.length == 0)
        return res
          .status(400)
          .json({ success: false, message: "No transaction found" });


      return res
        .status(200)
        .json({
          success: true,
          transactions: result
        });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({ success: false, err: error });
    }
  })
  .post(auth.verifyToken, verifyUser, async function (req, res, next) {
    try {
      if (!req.body.tokenId)
        return res
          .status(400)
          .json({ success: false, message: "tokenId not found in the body" });
      if (!req.body.from)
        return res
          .status(400)
          .json({ success: false, message: "from not found in the body" });
      if (!req.body.to)
        return res
          .status(400)
          .json({ success: false, message: "to not found in the body" });
      if (!req.body.transaction)
        return res
          .status(400)
          .json({
            success: false,
            message: "transaction not found in the body",
          });

      var data = {
        tokenId: req.body.tokenId,
        from: req.body.from,
        to: req.body.to,
        transaction: req.body.transaction,
      };

      var result = await transactionModel.create(data);

      console.log("result : ", result);

      return res
        .status(200)
        .json({ success: true, message: "Transaction successfully added" });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({ success: false, err: error });
    }
  });

assetRouter
  .route("/tokenTransaction/:tokenId")
  .get(async function (req, res, next) {
    try {
      var result = await transactionModel
        .find({ tokenId: req.params.tokenId })
        .select("-__v -_id");

      if (result.length == 0)
        return res
          .status(200)
          .json({
            success: false,
            message:
              "No transaction found against tokenId : " + req.params.tokenId,
          });

      return res.status(200).json({ success: true, transactions: result });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({ success: false, err: error });
    }
  });

module.exports = assetRouter;
