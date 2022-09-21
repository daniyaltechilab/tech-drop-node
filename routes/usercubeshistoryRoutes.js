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
const usercubeshistoryModel = require('../models/usercubeshistoryModel');

assetRouter.route('/createhistory')
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

                  if(!req.body.Bid)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "Bid not found in request body"
                     });
                  }
                  if(!req.body.address)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "address not found in request body"
                     });
                  }
                  var tokenresult=await TokenModel.findOne({_id:req.body.tokenId});

                  if(!tokenresult)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "There's no cube exists against this cubeId"
                     });
                  }

                  var auctionresult=await auctionModel.findOne({tokenId:req.body.tokenId});

                  if(!auctionresult)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "There's no cube exists in the marketplace against this cubeId"
                     });
                  }

                  var newusercubeshistory = new usercubeshistoryModel({
                    userId:result._id,
                    auctionId:auctionresult._id,
                    tokenId:req.body.tokenId,
                    Bid: req.body.Bid,
                    address:req.body.address,
                    claimFunds:false,
                    claimNft:false,
                    withdraw:false
                  })
     
                 await usercubeshistoryModel.create(newusercubeshistory);
                 auctionresult.minimumBid= auctionresult.bidDelta + req.body.Bid;
                 await auctionresult.save();
                 
                  return res.status(200).json({
                     success: true,
                     message:"Bid successfully added!"
                  });
      
      
               } catch (error) {
                  console.log("error (try-catch) : " + error);
                  return res.status(500).json({
                     success: false,
                     err: error
                  });
               }
            })  

assetRouter.route('/claimhistory')
            .put(
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
      
                        if(!req.body.address)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "address not found in request body"
                           });
                        }

                        var auctionresult=await auctionModel.findOne({_id:req.body.auctionId});
      
                        if(!auctionresult)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "There's no auction exists against this auctionId"
                           });
                        }
      
                        var tokenresult=await TokenModel.findOne({_id:req.body.tokenId});
      
                        if(!tokenresult)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "There's no cube exists against this cubeId"
                           });
                        }

                        const usercubeshistoryresult=await usercubeshistoryModel.findOne({auctionId:req.body.auctionId,tokenId:req.body.tokenId,address:req.body.address});

                        usercubeshistoryresult.claimFunds=req.body.claimFunds;
                        usercubeshistoryresult.claimNft=req.body.claimNft;
                        usercubeshistoryresult.withdraw=req.body.withdraw;

                        await usercubeshistoryresult.save();

                        return res.status(200).json({
                           success: true,
                           message:req.body.address + " checks successfully updated !"
                        });
            
            
                     } catch (error) {
                        console.log("error (try-catch) : " + error);
                        return res.status(500).json({
                           success: false,
                           err: error
                        });
                     }
                  })   
      
assetRouter.route('/history')
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
                    if(!req.body.auctionId)
                    {
                        return res.status(400).json({
                            success: false,
                            message: "auctionId not found in request body"
                        });
                    }
                     var usercubeshistoryresult = await usercubeshistoryModel.find({auctionId:req.body.auctionId,tokenId:req.body.tokenId});
                     console.log("usercubeshistoryresult = ", usercubeshistoryresult);
   
                     return res.status(200).json({
                        success: true,
                        UsercubeshistoryData: usercubeshistoryresult
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