var express = require('express');
var assetRouter = express.Router();

const auth = require('../middlewares/auth')
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
   session: false
});

const UserModel = require('../models/UserModel');
const auctionModel = require('../models/auctionModel');
const TokenModel = require('../models/tokenModel');

assetRouter.route('/deleteauction')
.post(
   auth.verifyToken, verifyUser,
   async function (req, res, next) {
   try {
         
      if(!req.body.auctionId)
      {
         return res.status(400).json({
            success: false,
            message: "auctionId not found in request body"
         });
      }

      if(!req.body.tokenId)
      {
         return res.status(400).json({
            success: false,
            message: "tokenId not found in request body"
         });
      }

      var auctionresult = await auctionModel.findOne({_id:req.body.auctionId});
      console.log("auctionresult = ", auctionresult);

      if(!auctionresult)
      {
         return res.status(400).json({
            success: false,
            message: "auction not found against this auctionId"
         });
      }

      var tokenresult = await TokenModel.findOne({_id:req.body.tokenId});
      console.log("tokenresult = ", tokenresult);

      if(!tokenresult)
      {
         return res.status(400).json({
            success: false,
            message: "token not found against this tokenId"
         });
      }
      tokenresult.salestatus=false;
      await tokenresult.save();

     await auctionModel.deleteOne({_id:auctionresult._id});

      return res.status(200).json({
         success: true,
         message: "Auction or Sale Successfully Deleted."
      });

   } catch (error) {
      console.log("error (try-catch) : " + error);
      return res.status(500).json({
         success: false,
         err: error
      });
   }
})

assetRouter.route('/createauction')
      .post(
            auth.verifyToken, verifyUser,
            async function (req, res, next) {
         
               try {
      
                  var result = await UserModel.findOne({
                     address: req.user.address,
                     network:req.user.network
                  });
      
                  if (!result) {
                     return res.status(400).json({
                        success: false,
                        message: "No record found aaginst this (" + req.user.network + ") ethereum address"
                     });
                  }

                  if(!req.body.tokenId)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "tokenId not found in request body"
                     });
                  }

                  if(!req.body.auctionStartsAt)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "AuctionStartsAt not found in request body"
                     });
                  }

                  if(!req.body.auctionEndsAt)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "AuctionEndsAt not found in request body"
                     });
                  }

                  if(!req.body.minimumBid)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "MinimumBid not found in request body"
                     });
                  }

                  if(!req.body.bidDelta)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "bidDelta not found in request body"
                     });
                  }
                 
                  var newauction = new auctionModel({
                    userId:result._id,
                    auctionId:req.body.auctionId,
                    tokenId:req.body.tokenId,
                    auctionStartsAt: req.body.auctionStartsAt,
                    auctionEndsAt: req.body.auctionEndsAt,
                    minimumBid: req.body.minimumBid,
                    bidDelta:req.body.bidDelta,
                    check:"auction"
                  })
     
                 await auctionModel.create(newauction);

                 var tokenresult= await TokenModel.findOne({_id:req.body.tokenId});

                  tokenresult.salestatus= true;
                  await tokenresult.save();

                  return res.status(200).json({
                     success: true,
                     message:"Auction successfully created!"
                  });
      
      
               } catch (error) {
                  console.log("error (try-catch) : " + error);
                  return res.status(500).json({
                     success: false,
                     err: error
                  });
               }
            })    

assetRouter.route('/createsale')
            .post(
                  auth.verifyToken, verifyUser,
                  async function (req, res, next) {
               
                     try {
            
                        var result = await UserModel.findOne({
                           address: req.user.address,
                           network:req.user.network
                        });
            
                        if (!result) {
                           return res.status(400).json({
                              success: false,
                              message: "No record found aaginst this (" + req.user.network + ") ethereum address"
                           });
                        }
      
                        if(!req.body.tokenId)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "tokenId not found in request body"
                           });
                        }
      
                        if(!req.body.salePrice)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "salePrice not found in request body"
                           });
                        }

                        if(!req.body.expiresAt)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "expiresAt not found in request body"
                           });
                        }
                       
                        var newauction = new auctionModel({
                          userId:result._id,
                          tokenId:req.body.tokenId,
                          salePrice: req.body.salePrice,
                          expiresAt:req.body.expiresAt,
                          check:"sale",
                        })
           
                       await auctionModel.create(newauction);

                        var tokenresult= await TokenModel.findOne({_id:req.body.tokenId});

                        tokenresult.SalePrice= req.body.salePrice;
                        tokenresult.salestatus= true;
                        await tokenresult.save();

                        return res.status(200).json({
                           success: true,
                           message:"Sale successfully created!"
                        });
            
            
                     } catch (error) {
                        console.log("error (try-catch) : " + error);
                        return res.status(500).json({
                           success: false,
                           err: error
                        });
                     }
                  })

module.exports = assetRouter;