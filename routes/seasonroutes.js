var express = require('express');
var assetRouter = express.Router();

const auth = require('../middlewares/auth')
const { checkIsInRole } = require("../middlewares/authCheckRole");
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
   session: false
});

const UserModel = require('../models/UserModel');
const seasonModel = require('../models/seasonModel');
const dropModel = require('../models/dropModel');

assetRouter.route('/createseason')
      .post(
            auth.verifyToken, verifyUser,
            async function (req, res, next) {
         
               try {
      
                  var result = await UserModel.findOne({
                     username: req.user.username
                   });
                   console.log("result : ", result);
               
                   if(!result)
                   {
                      return res.status(400).json({
                     success: false,
                     message: "user dont exist against this username",
               
                     });
                   }

                  if(!req.body.dropId)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "dropId not found in request body"
                     });
                  }

                  if(!req.body.title)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "title not found in request body"
                     });
                  }

                  if(!req.body.description)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "description not found in request body"
                     });
                  }

                  if(!req.body.image)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "image not found in request body"
                     });
                  }

                  var newseason = new seasonModel({
                    dropId:req.body.dropId,
                    title: req.body.title,
                    description: req.body.description,
                    image: req.body.image
                  })
     
                 await seasonModel.create(newseason);

                  return res.status(200).json({
                     success: true,
                     message:"Season successfully created!"
                  });
      
      
               } catch (error) {
                  console.log("error (try-catch) : " + error);
                  return res.status(500).json({
                     success: false,
                     err: error
                  });
               }
            })    
assetRouter.route('/seasons/:start/:end')   
.get(
   auth.verifyToken, verifyUser,
   async function (req, res, next) {

      try {

         var result = await UserModel.findOne({
            username: req.user.username
          });
          console.log("result : ", result);
      
          if(!result)
          {
             return res.status(400).json({
            success: false,
            message: "user dont exist against this username",
      
            });
          }

         if (!req.params.start) {
            return res.status(400).json({
               success: false,
               message: "start not found in the params"
            });
         }

         if (!req.params.end) {
            return res.status(400).json({
               success: false,
               message: "end not found in the params"
            });
         }

         var seasonresult1 = await seasonModel.find({});
         
         console.log("seasonresult = ", seasonresult1);

         var seasonresult=seasonresult1.reverse();
            
         var paginationresult= seasonresult.slice(req.params.start,req.params.end);

         return res.status(200).json({
            success: true,
            Seasondata: paginationresult,
            Seasonscount:seasonresult.length
         });

      } catch (error) {
         console.log("error (try-catch) : " + error);
         return res.status(500).json({
            success: false,
            err: error
         });
      }
   })  

assetRouter.route('/seasons') 
.get(
   auth.verifyToken, verifyUser,
   async function (req, res, next) {

      try {

         var result = await UserModel.findOne({
            username: req.user.username
          });
          console.log("result : ", result);
      
          if(!result)
          {
             return res.status(400).json({
            success: false,
            message: "user dont exist against this username",
      
            });
          }

         var seasonresult = await seasonModel.find({});
         
         console.log("seasonresult = ", seasonresult);

         return res.status(200).json({
            success: true,
            Seasondata: seasonresult
         });

      } catch (error) {
         console.log("error (try-catch) : " + error);
         return res.status(500).json({
            success: false,
            err: error
         });
      }
   })  

   .post(
               auth.verifyToken, verifyUser,
               async function (req, res, next) {
            
                  try {
         
                     var result = await UserModel.findOne({
                        username: req.user.username
                      });
                      console.log("result : ", result);
                  
                      if(!result)
                      {
                         return res.status(400).json({
                        success: false,
                        message: "user dont exist against this username",
                  
                        });
                      }

                     if (!req.body.seasonId) {
                        return res.status(400).json({
                           success: false,
                           message: "seasonId not found in the body."
                        });
                     }
                     var seasonresult = await seasonModel.findOne({_id:req.body.seasonId});
                     console.log("seasonresult = ", seasonresult);
                     
                     var data=[];
                     for(var i=0;i<seasonresult.dropId.length;i++)
                     {
                        console.log("DropIdIds"+" at "+i+"index is = "+seasonresult.dropId[i]);
                        var dropdata=await dropModel.find({_id:seasonresult.dropId[i]});
                        console.log("Dropdata"+" at "+i+"index is = "+dropdata);
                        data.push(dropdata);
                     }
                     
                     return res.status(200).json({
                        success: true,
                        Seasondata: seasonresult,
                        Dropdata:data
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