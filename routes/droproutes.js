var express = require("express");
var assetRouter = express.Router();

const auth = require("../middlewares/auth");
const { checkIsInRole } = require("../middlewares/authCheckRole");
const passport = require("passport");
const verifyUser = passport.authenticate("jwt", {
  session: false,
});

const UserModel = require("../models/UserModel");
const dropModel = require("../models/dropModel");
const TokenModel = require("../models/tokenModel");
const NftModel = require("../models/nftModel");

assetRouter
  .route("/createdrop")
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

      if (!req.body.title) {
        return res.status(400).json({
          success: false,
          message: "title not found in request body",
        });
      }

      if (!req.body.description) {
        return res.status(400).json({
          success: false,
          message: "description not found in request body",
        });
      }

      if (!req.body.image) {
        return res.status(400).json({
          success: false,
          message: "image not found in the request body",
        });
      }
      if (!req.body.tokenId) {
        return res.status(400).json({
          success: false,
          message: "tokenId not found in request body",
        });
      }

      if (!req.body.dropId) {
        return res.status(400).json({
          success: false,
          message: "dropId not found in request body",
        });
      }
      if (!req.body.AuctionStartsAt) {
        return res.status(400).json({
          success: false,
          message: "AuctionStartsAt not found in request body",
        });
      }

      if (!req.body.AuctionEndsAt) {
        return res.status(400).json({
          success: false,
          message: "AuctionEndsAt not found in request body",
        });
      }

      if (!req.body.MinimumBid) {
        return res.status(400).json({
          success: false,
          message: "MinimumBid not found in request body",
        });
      }

      if (!req.body.bidDelta) {
        return res.status(400).json({
          success: false,
          message: "bidDelta not found in request body",
        });
      }

      for (var i = 0; i < req.body.tokenId.length; i++) {
        var tokendata = await TokenModel.findByIdAndUpdate(
          req.body.tokenId[i],
          {
            check: "auction",
          }
        );
      }

      var newdrop = new dropModel({
        tokenId: req.body.tokenId,
        dropId: req.body.dropId,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        AuctionStartsAt: req.body.AuctionStartsAt,
        AuctionEndsAt: req.body.AuctionEndsAt,
        MinimumBid: req.body.MinimumBid,
        bidDelta: req.body.bidDelta,
      });

      await dropModel.create(newdrop);

      return res.status(200).json({
        success: true,
        message: "Drop successfully created!",
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
  .route("/deletedrop")
  .post(auth.verifyToken, verifyUser, async function (req, res, next) {
    try {
      if (!req.body.dropId) {
        return res.status(400).json({
          success: false,
          message: "dropId not found in request body",
        });
      }

      var dropresult = await dropModel.findOne({ _id: req.body.dropId });
      console.log("dropresult = ", dropresult);

      if (!dropresult) {
        return res.status(400).json({
          success: fasle,
          message: "Drop not found against this dropId",
        });
      }

      await dropModel.deleteOne({ _id: dropresult._id });

      return res.status(200).json({
        success: true,
        message: "Drop Successfully Deleted",
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
  .route("/createrandomdrop")
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

      if (!req.body.SalePrice) {
        return res.status(400).json({
          success: false,
          message: "SalePrice not found in request body",
        });
      }

      if (!req.body.AuctionStartsAt) {
        return res.status(400).json({
          success: false,
          message: "AuctionStartsAt not found in request body",
        });
      }

      if (!req.body.AuctionEndsAt) {
        return res.status(400).json({
          success: false,
          message: "AuctionEndsAt not found in request body",
        });
      }

      if (!req.body.MinimumBid) {
        return res.status(400).json({
          success: false,
          message: "MinimumBid not found in request body",
        });
      }
      //work of algorithm(to choose tokenids) starts here....

      //work of algorithm(to choose tokenids)ends here....

      var newdrop = new dropModel({
        //tokenids will come here by an algorithm
        AuctionStartsAt: req.body.AuctionStartsAt,
        AuctionEndsAt: req.body.AuctionEndsAt,
        MinimumBid: req.body.MinimumBid,
      });

      await dropModel.create(newdrop);

      return res.status(200).json({
        success: true,
        message: "Drop successfully created!",
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  });

assetRouter.route("/drops/:start/:end").get(async function (req, res, next) {
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

    var dropresult1 = await dropModel.find({});
    console.log("dropresult1 = ", dropresult1);

    var dropresult = dropresult1.reverse();

    console.log("dropresult = ", dropresult);

    var paginationresult = dropresult.slice(req.params.start, req.params.end);

    return res.status(200).json({
      success: true,
      Dropdata: paginationresult,
      Dropscount: dropresult.length,
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
  .route("/drops")
  .get(async function (req, res, next) {
    try {
      var dropresult = await dropModel.find({});
      console.log("dropresult = ", dropresult);

      return res.status(200).json({
        success: true,
        Dropdata: dropresult,
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  })
  .post(async function (req, res, next) {
    try {
      if (!req.body.dropId) {
        return res.status(400).json({
          success: false,
          message: "dropId not found in the body.",
        });
      }
      var dropresult = await dropModel.findOne({ _id: req.body.dropId });
      console.log("dropresult = ", dropresult);

      var data = [];
      var dataarray = [];
      for (var i = 0; i < dropresult.tokenId.length; i++) {
        console.log(
          "TokenIds" + " at " + i + "index is = " + dropresult.tokenId[i]
        );
        var tokendata = await TokenModel.findOne({
          _id: dropresult.tokenId[i],
        });
        console.log("Tokendata" + " at " + i + "index is = " + tokendata);
        data.push(tokendata);

        var nftdata = [tokendata.nftids.length];
        for (var j = 0; j < tokendata.nftids.length; j++) {
          console.log(
            "NftId" + " at " + j + "index is = " + tokendata.nftids[j]
          );
          var nft = await NftModel.findOne({ _id: tokendata.nftids[j] }).select(
            "artwork type"
          );
          console.log("Nftdata" + " at " + j + "index is = " + nft);
          nftdata[j] = nft;
        }
        dataarray.push(nftdata);
      }

      return res.status(200).json({
        success: true,
        Dropdata: dropresult,
        Tokensdata: data,
        Nftdata: dataarray,
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
