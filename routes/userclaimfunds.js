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
const userclaimfundsModel = require('../models/userclaimfunds');
   
assetRouter.route('/claimfunds')
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

                        var newuserrecord = new userclaimfundsModel({
                            tokenId:req.body.tokenId,
                            auctionId:req.body.auctionId,
                            address:req.body.address,
                            claimFunds:true
                          })
             
                         await userclaimfundsModel.create(newuserrecord);

                         tokenresult.userclaimfunds=true;
                         await tokenresult.save();

                        return res.status(200).json({
                           success: true,
                           message:req.body.address + " funds successfully claimed !"
                        });
            
            
                     } catch (error) {
                        console.log("error (try-catch) : " + error);
                        return res.status(500).json({
                           success: false,
                           err: error
                        });
                     }
                  })   
            
                  
assetRouter.route('/getclaimfunds/')
            .post(
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
   
                     if(!req.body.address)
                     {
                       return res.status(400).json({
                           success: false,
                           message: "address not found in request body"
                        });
                     }
         
                     var userclaimfundsresult = await userclaimfundsModel.findOne({auctionId:req.body.auctionId,tokenId:req.body.tokenId,address:req.body.address});
                     console.log("userclaimfundsresult = ", userclaimfundsresult);
   
                     return res.status(200).json({
                        success: true,
                        Userclaimfundsresult: userclaimfundsresult
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