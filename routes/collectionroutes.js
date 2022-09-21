var express = require("express");
var assetRouter = express.Router();

const auth = require("../middlewares/auth");
const { checkIsInRole } = require("../middlewares/authCheckRole");
const passport = require("passport");
const verifyUser = passport.authenticate("jwt", {
  session: false,
});

const UserModel = require("../models/UserModel");
const TokenModel = require("../models/tokenModel");
const collectionModel = require("../models/collectionModel");
const NftModel = require("../models/nftModel");

assetRouter
  .route("/createcollection")
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

      if (!req.body.collectiontitle) {
        return res.status(400).json({
          success: false,
          message: "collectiontitle not found in request body",
        });
      }

      var newcollection = new collectionModel({
        collectiontitle: req.body.collectiontitle,
      });

      await collectionModel.create(newcollection);

      return res.status(200).json({
        success: true,
        message: "Collection created successfully!",
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

assetRouter
  .route("/collections/:start/:end")
  .get(auth.verifyToken, verifyUser, async function (req, res, next) {
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

      var collectionresult1 = await collectionModel.find({});

      console.log("Collectionresult = ", collectionresult1);

      var collectionresult = collectionresult1.reverse();

      var paginationresult = collectionresult.slice(
        req.params.start,
        req.params.end
      );

      return res.status(200).json({
        success: true,
        Collectiondata: paginationresult,
        CollectionCount: collectionresult.length,
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

assetRouter
  .route("/collections")
  .get(auth.verifyToken, verifyUser, async function (req, res, next) {
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

      var collectionresult = await collectionModel.find({});

      console.log("Collectionresult = ", collectionresult);

      return res.status(200).json({
        success: true,
        Collectiondata: collectionresult,
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  })

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

      if (!req.body.collectionId) {
        return res.status(400).json({
          success: false,
          message: "collectionId not found in the request body",
        });
      }

      var collectionresult = await collectionModel.findOne({
        _id: req.body.collectionId,
      });
      console.log("Collectionresult = ", collectionresult);

      if (!collectionresult) {
        return res.status(400).json({
          success: false,
          message: "Collection not found against this collectionId.",
        });
      }
      var data = [];
      for (var i = 0; i < collectionresult.nftId.length; i++) {
        console.log(
          "NftIds" + " at " + i + "index is = " + collectionresult.nftId[i]
        );
        var nftdata = await NftModel.find({ _id: collectionresult.nftId[i] });
        console.log("Nftdata" + " at " + i + "index is = " + nftdata);
        data.push(nftdata);
      }

      return res.status(200).json({
        success: true,
        Nftsdata: data,
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
