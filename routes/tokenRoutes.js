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
const profileModel = require("../models/profileModel");
const NftModel = require("../models/nftModel");
const dropModel = require("../models/dropModel");
const auctionModel = require("../models/auctionModel");

assetRouter.route("/SingleTokenId").post(async function (req, res, next) {
  try {
    if (!req.body.tokenId) {
      return res.status(400).json({
        success: false,
        message: "tokenId not found in the request body",
      });
    }

    if (!req.body.check) {
      return res.status(400).json({
        success: false,
        message: "check not found in the request body",
      });
    }

    if (req.body.check == "drop") {
      if (!req.body.dropId) {
        return res.status(400).json({
          success: false,
          message: "dropId not found in the request body",
        });
      }
    }

    var auctionresult;
    if (req.body.check == "userauction") {
      if (!req.body.auctionId) {
        return res.status(400).json({
          success: false,
          message: "auctionId not found in the request body",
        });
      }
      auctionresult = await auctionModel.findOne({
        _id: req.body.auctionId,
      });
    }
    var tokenresult = await TokenModel.findOne({
      _id: req.body.tokenId,
    });

    console.log("Tokenresult = ", tokenresult);

    var dropresult;

    if (tokenresult.check == "auction") {
      dropresult = await dropModel.findOne({
        _id: req.body.dropId,
      });
    }

    var data = [];
    for (var i = 0; i < tokenresult.nftids.length; i++) {
      console.log("NftId" + " at " + i + "index is = " + tokenresult.nftids[i]);
      var nftdata = await NftModel.find({ _id: tokenresult.nftids[i] });
      console.log("Nftdata" + " at " + i + "index is = " + nftdata);
      data.push(nftdata);
    }

    return res.status(200).json({
      success: true,
      Dropdata: dropresult,
      UserAuctiondata: auctionresult,
      tokensdata: tokenresult,
      nftdata: data,
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
  .route("/TokenIds/:start/:end")
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

      var tokenresultarray1 = await TokenModel.find({
        userId: result._id,
      });

      var tokenresultarray = tokenresultarray1.reverse();

      var paginationresult = tokenresultarray.slice(
        req.params.start,
        req.params.end
      );

      var dataarray = [];
      for (var j = 0; j < paginationresult.length; j++) {
        var data = [paginationresult[j].nftids.length];
        for (var i = 0; i < paginationresult[j].nftids.length; i++) {
          console.log(
            "NftId" + " at " + i + "index is = " + paginationresult[j].nftids[i]
          );
          var nftdata = await NftModel.findOne({
            _id: paginationresult[j].nftids[i],
          }).select("artwork type");
          console.log("Nftdata" + " at " + i + "index is = " + nftdata);
          data[i] = nftdata;
        }
        dataarray.push(data);
      }

      return res.status(200).json({
        success: true,
        tokensdata: paginationresult,
        nftsdata: dataarray,
        tokencount: tokenresultarray.length,
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
  .route("/userTokenIds/:start/:end")
  .get(auth.verifyToken, verifyUser, async function (req, res, next) {
    try {
      var result = await UserModel.findOne({
        address: req.user.address,
        network: req.user.network,
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

      var tokenresultarray1 = await TokenModel.find({
        userId: result._id,
      });

      var tokenresultarray = tokenresultarray1.reverse();

      var paginationresult = tokenresultarray.slice(
        req.params.start,
        req.params.end
      );

      var dataarray = [];
      for (var j = 0; j < paginationresult.length; j++) {
        var data = [paginationresult[j].nftids.length];
        for (var i = 0; i < paginationresult[j].nftids.length; i++) {
          console.log(
            "NftId" + " at " + i + "index is = " + paginationresult[j].nftids[i]
          );
          var nftdata = await NftModel.findOne({
            _id: paginationresult[j].nftids[i],
          }).select("artwork type");
          console.log("Nftdata" + " at " + i + "index is = " + nftdata);
          data[i] = nftdata;
        }
        dataarray.push(data);
      }

      return res.status(200).json({
        success: true,
        tokensdata: paginationresult,
        nftsdata: dataarray,
        tokencount: tokenresultarray.length,
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
  .route("/TokenIdsnotonauction")
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

      var tokenresultarray = await TokenModel.find({
        userId: result._id,
        check: "created",
      });

      var dataarray = [];
      for (var j = 0; j < tokenresultarray.length; j++) {
        var data = [tokenresultarray[j].nftids.length];
        for (var i = 0; i < tokenresultarray[j].nftids.length; i++) {
          console.log(
            "NftId" + " at " + i + "index is = " + tokenresultarray[j].nftids[i]
          );
          var nftdata = await NftModel.findOne({
            _id: tokenresultarray[j].nftids[i],
          }).select("artwork type");
          console.log("Nftdata" + " at " + i + "index is = " + nftdata);
          data[i] = nftdata;
        }
        dataarray.push(data);
      }

      return res.status(200).json({
        success: true,
        tokensdata: tokenresultarray,
        nftsdata: dataarray,
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
  .route("/TokenIds")
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

      var tokenresultarray = await TokenModel.find({
        userId: result._id,
      });

      var dataarray = [];
      for (var j = 0; j < tokenresultarray.length; j++) {
        var data = [tokenresultarray[j].nftids.length];
        for (var i = 0; i < tokenresultarray[j].nftids.length; i++) {
          console.log(
            "NftId" + " at " + i + "index is = " + tokenresultarray[j].nftids[i]
          );
          var nftdata = await NftModel.findOne({
            _id: tokenresultarray[j].nftids[i],
          }).select("artwork type");
          console.log("Nftdata" + " at " + i + "index is = " + nftdata);
          data[i] = nftdata;
        }
        dataarray.push(data);
      }

      return res.status(200).json({
        success: true,
        tokensdata: tokenresultarray,
        nftsdata: dataarray,
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  })

  .post(
    auth.verifyToken,
    verifyUser,
    checkIsInRole("admin"),
    async function (req, res, next) {
      try {
        if (!req.body.title)
          return res.status(400).json({
            success: false,
            message: "title not found in the body !",
          });

        if (!req.body.description)
          return res.status(400).json({
            success: false,
            message: "description not found in the body !",
          });

        if (!req.body.SalePrice) {
          return res.status(400).json({
            success: false,
            message: "SalePrice not found in request body",
          });
        }

        if (!req.body.nftids)
          return res.status(400).json({
            success: false,
            message: "nftids not found in the body !",
          });

        if (!req.body.ownermusicfile)
          return res.status(400).json({
            success: false,
            message: "ownermusicfile not found in the body !",
          });

        if (!req.body.nonownermusicfile)
          return res.status(400).json({
            success: false,
            message: "nonownermusicfile not found in the body !",
          });

        if (!req.body.musicartisttype)
          return res.status(400).json({
            success: false,
            message: "musicartisttype not found in the body !",
          });

        if (!req.body.MusicArtistName) {
          return res.status(400).json({
            success: false,
            message: "MusicArtistName not found in request body",
          });
        }
        if (!req.body.MusicArtistProfile) {
          return res.status(400).json({
            success: false,
            message: "MusicArtistProfile not found in request body",
          });
        }

        if (!req.body.MusicArtistAbout) {
          return res.status(400).json({
            success: false,
            message: "MusicArtistAbout not found in request body",
          });
        }

        if (!req.body.address)
          return res.status(400).json({
            success: false,
            message: "address not found in the body !",
          });

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

        var newToken = new TokenModel({
          userId: result._id,
          address: req.body.address,
          tokenId: req.body.tokenId,
          title: req.body.title,
          description: req.body.description,
          SalePrice: req.body.SalePrice,
          nftids: req.body.nftids,
          ownermusicfile: req.body.ownermusicfile,
          nonownermusicfile: req.body.nonownermusicfile,
          MusicArtistName: req.body.MusicArtistName,
          MusicArtistProfile: req.body.MusicArtistProfile,
          MusicArtistAbout: req.body.MusicArtistAbout,
          check: "created",
          adminclaimfunds: false,
          userclaimfunds: false,
          salestatus: false,
        });

        await TokenModel.create(newToken);

        if (req.body.musicartisttype == "New") {
          var newprofile = new profileModel({
            role: "Music Artist",
            Name: req.body.MusicArtistName,
            Profile: req.body.MusicArtistProfile,
            About: req.body.MusicArtistAbout,
          });
          await profileModel.create(newprofile);
        }

        for (var i = 0; i < newToken.nftids.length; i++) {
          var result = await NftModel.findOne({ _id: newToken.nftids[i] });
          console.log("RES : ", result);
          var result2 = result.tokensupplyalternative - 1;
          console.log("Result2 : ", result2);
          await NftModel.findByIdAndUpdate(newToken.nftids[i], {
            tokensupplyalternative: result2,
          });
        }

        return res.status(200).json({
          success: true,
          message: "New Token successfully created!",
        });
      } catch (error) {
        console.log("error (try-catch) : " + error);
        return res.status(500).json({
          success: false,
          err: error,
        });
      }
    }
  );

assetRouter.post(
  "/buyToken",

  auth.verifyToken,
  verifyUser,
  async (req, res) => {
    try {
      if (!req.body.dropId)
        return res.status(200).json({
          success: false,
          message: "dropId not found in the body !",
        });

      if (!req.body.tokenId)
        return res.status(200).json({
          success: false,
          message: "tokenId not found in the body !",
        });

      const tokenresult = await TokenModel.findOne({ _id: req.body.tokenId });
      if (tokenresult.adminclaimfunds == false) {
        return res.status(400).json({
          success: false,
          message: "Admin has not claim funds yet.",
        });
      }
      var newOwner = await UserModel.findOne({
        address: req.user.address,
        network: req.user.network,
      });

      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message:
            "No record found aaginst this (" +
            req.user.network +
            ") ethereum address",
        });
      }

      console.log("newOwner : ", newOwner);
      console.log("newOwner id : ", newOwner._id);

      const dropresult = await dropModel.findOne({ _id: req.body.dropId });

      var index = dropresult.tokenId.indexOf(req.body.tokenId);
      if (index == -1)
        return res.status(200).json({
          success: false,
          message:
            "TokenId " +
            req.body.tokenId +
            " is not available against dropId " +
            req.body.dropId,
        });

      dropresult.tokenId.splice(index, 1);
      await dropresult.save();

      tokenresult.userId = newOwner._id;
      tokenresult.address = newOwner.address;
      await tokenresult.save();
      console.log("Cube ownership transferred.");

      return res.status(200).json({
        success: true,
        message: "Cube successfully transferred",
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  }
);

assetRouter.post(
  "/buyuserToken",

  auth.verifyToken,
  verifyUser,
  async (req, res) => {
    try {
      if (!req.body.auctionId)
        return res.status(200).json({
          success: false,
          message: "auctionId not found in the body !",
        });

      if (!req.body.tokenId)
        return res.status(200).json({
          success: false,
          message: "tokenId not found in the body !",
        });

      var newOwner = await UserModel.findOne({
        address: req.user.address,
        network: req.user.network,
      });

      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message:
            "No record found aaginst this (" +
            req.user.network +
            ") ethereum address",
        });
      }

      console.log("newOwner : ", newOwner);
      console.log("newOwner id : ", newOwner._id);

      const auctionresult = await auctionModel.findOne({
        _id: req.body.auctionId,
      });
      await auctionModel.deleteOne({ _id: auctionresult._id });

      const tokenresult = await TokenModel.findOne({ _id: req.body.tokenId });

      tokenresult.userId = newOwner._id;
      tokenresult.address = newOwner.address;
      tokenresult.salestatus = false;
      tokenresult.userclaimfunds = false;
      await tokenresult.save();
      console.log("Cube ownership transferred.");

      return res.status(200).json({
        success: true,
        message: "Cube successfully transferred",
      });
    } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
        success: false,
        err: error,
      });
    }
  }
);
module.exports = assetRouter;
