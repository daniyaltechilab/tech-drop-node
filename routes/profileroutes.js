var express = require('express');
var assetRouter = express.Router();

const auth = require('../middlewares/auth')
const { checkIsInRole } = require("../middlewares/authCheckRole");
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
   session: false
});

const UserModel = require('../models/UserModel');
const profileModel = require('../models/profileModel');


assetRouter.route('/createprofile')
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
   
               var imageartistresult = await profileModel.find({role:"Image Artist"});
               var musicartistresult = await profileModel.find({role:"Music Artist"});
               var producerresult = await profileModel.find({role:"Producer"});
               var executiveproducerresult = await profileModel.find({role:"Executive Producer"});
               var fanresult = await profileModel.find({role:"Fan"});
               console.log("imageartistresult = ", imageartistresult);
               console.log("musicartistresult = ", musicartistresult);
               console.log("producerresult = ", producerresult);
               console.log("executiveproducerresult = ", executiveproducerresult);
               console.log("fanresult = ", fanresult);

               return res.status(200).json({
                  success: true,
                  Imageartist: imageartistresult,
                  Musicartist:musicartistresult,
                  Producer:producerresult,
                  ExecutiveProducer:executiveproducerresult,
                  Fan:fanresult
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

                  if(!req.body.Name)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "Name not found in request body"
                     });
                  }
                  if(!req.body.Profile)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "Profile not found in request body"
                     });
                  }
                  if(!req.body.role)
                  {
                    return res.status(400).json({
                        success: false,
                        message: "role not found in request body"
                     });
                  }
                  if(req.body.role == "Image Artist")
                  {
                     if(!req.body.Website)
                     {
                        return res.status(400).json({
                              success: false,
                              message: "Website not found in request body"
                           });
                     }
                     if(!req.body.About)
                     {
                        return res.status(400).json({
                              success: false,
                              message: "About not found in request body"
                           });
                     }
                     var newprofile = new profileModel({
                        role:req.body.role,
                        Name:req.body.Name,
                        Profile:req.body.Profile,
                        Website:req.body.Website,
                        About:req.body.About
                     })
                     await profileModel.create(newprofile);
                  }
                  else if(req.body.role == "Music Artist")
                  {

                     if(!req.body.About)
                     {
                        return res.status(400).json({
                              success: false,
                              message: "About not found in request body"
                           });
                     }
                     var newprofile = new profileModel({
                        role:req.body.role,
                        Name:req.body.Name,
                        Profile:req.body.Profile,
                        About:req.body.About
                      })
                      await profileModel.create(newprofile);
                  }
                  else if(req.body.role == "Producer" || req.body.role == "Executive Producer" || req.body.role == "Fan")
                  {
                     if(!req.body.Inspiration)
                     {
                        return res.status(400).json({
                              success: false,
                              message: "Inspiration not found in request body"
                           });
                     }
                     var newprofile = new profileModel({
                        role:req.body.role,
                        Name:req.body.Name,
                        Profile:req.body.Profile,
                        Inspiration:req.body.Inspiration,
                      })
                      await profileModel.create(newprofile);
                  }
                    
                  return res.status(200).json({
                     success: true,
                     message:"Profile successfully created!"
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