var express = require('express');
var assetRouter = express.Router();

const auth = require('../middlewares/auth')
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
   session: false
});

const UserModel = require('../models/UserModel');
const dropModel = require('../models/dropModel');
const TokenModel = require('../models/tokenModel');
const dropcubeshistoryModel = require('../models/dropcubeshistoryModel');

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

                  if(!req.body.dropId)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "dropId not found in request body"
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

                  var dropresult=await dropModel.findOne({_id:req.body.dropId});

                  if(!dropresult)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "There's no drop exists against this dropId"
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

                  var newdropcubeshistory = new dropcubeshistoryModel({
                    userId:result._id  ,
                    dropId:req.body.dropId,
                    tokenId:req.body.tokenId,
                    Bid: req.body.Bid,
                    address:req.body.address,
                    claimFunds:false,
                    claimNft:false,
                    withdraw:false
                  })
     
                 await dropcubeshistoryModel.create(newdropcubeshistory);

                  dropresult.MinimumBid=dropresult.bidDelta+req.body.Bid;
                  await dropresult.save();
                  
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
      
                        if(!req.body.dropId)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "dropId not found in request body"
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

                        var dropresult=await dropModel.findOne({_id:req.body.dropId});
      
                        if(!dropresult)
                        {
                          return res.status(400).json({
                              success: false,
                              message: "There's no drop exists against this dropId"
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

                        const dropcubeshistoryresult=await dropcubeshistoryModel.findOne({dropId:req.body.dropId,tokenId:req.body.tokenId,address:req.body.address});

                        dropcubeshistoryresult.claimFunds=req.body.claimFunds;
                        dropcubeshistoryresult.claimNft=req.body.claimNft;
                        dropcubeshistoryresult.withdraw=req.body.withdraw;

                        await dropcubeshistoryresult.save();

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
               async function (req, res, next) {
            
                  try {
         

                     if(!req.body.dropId)
                    {
                            return res.status(400).json({
                                success: false,
                                message: "dropId not found in request body"
                            });
                    }

                    if(!req.body.tokenId)
                    {
                        return res.status(400).json({
                            success: false,
                            message: "tokenId not found in request body"
                        });
                    }
         
                     var dropresult = await dropcubeshistoryModel.find({dropId:req.body.dropId,tokenId:req.body.tokenId});
                     console.log("dropresult = ", dropresult);
   
                     return res.status(200).json({
                        success: true,
                        Dropcubeshistorydata: dropresult
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