var express = require('express');
var assetRouter = express.Router();

const auth= require('../middlewares/auth')
const { checkIsInRole } = require("../middlewares/authCheckRole");
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
   session: false
});

const UserModel = require('../models/UserModel');
const NftModel = require('../models/nftModel');
const profileModel = require('../models/profileModel');
const collectionModel = require('../models/collectionModel');


assetRouter.route('/createnft/:start/:end')
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

            var nftresult2=[];
            var nftresult1 = await NftModel.find({adminId:result._id});
             console.log("Nftresult = ", nftresult1);

            var nftresult=nftresult1.reverse();

            for(var i=0;i<nftresult.length;i++)
            {
                  if(nftresult[i].tokensupplyalternative>0)
                  {
                     nftresult2.push(nftresult[i]);
                  }
            }
   
            var paginationresult= nftresult2.slice(req.params.start,req.params.end);

            return res.status(200).json({
               success: true,
               NFTdata: paginationresult,
               Nftcount: nftresult2.length
            });


         } catch (error) {
            console.log("error (try-catch) : " + error);
            return res.status(500).json({
               success: false,
               err: error
            });
         }
      })

assetRouter.route('/createnft')
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

         var nftresult2=[];

         
         var nftresult = await NftModel.find({adminId:result._id});
         console.log("Nftresult = ", nftresult);

         for(var i=0;i<nftresult.length;i++)
         {
            if(nftresult[i].tokensupplyalternative>0)
            {
                nftresult2.push(nftresult[i]);
            }
         }

         return res.status(200).json({
            success: true,
            NFTdata: nftresult2
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
      auth.verifyToken, verifyUser,checkIsInRole("admin"),
      async function (req, res, next) {

         try {
            
            if (!req.body.nftdata)
            return res.status(400).json({
               success: false,
               message: "nftdata not found in the body !"
            });

            for(var i=0;i<req.body.nftdata.length;i++)
         {

            if (!req.body.nftdata[i].nftId)
            {
               if (req.body.nftdata[i].nftId != 0)
               {
                  return res.status(400).json({
                     success: false,
                     message: "nftId not found in the NFT "+i+" body !"
                  });
               }
            }

            if (!req.body.nftdata[i].title)
               return res.status(400).json({
                  success: false,
                  message: "title not found in the NFT "+i+" body !"
               }); 

            if (!req.body.nftdata[i].description)
               return res.status(400).json({
                  success: false,
                  message: "description not found in the NFT "+i+" body !"
               }); 
            if (!req.body.nftdata[i].type)
               return res.status(400).json({
                  success: false,
                  message: "type not found in the NFT "+i+" body !"
               }); 
            if (!req.body.nftdata[i].artwork)
               return res.status(400).json({
                  success: false,
                  message: "artwork not found in the NFT "+i+" body !"
               }); 

            if (!req.body.nftdata[i].tokensupply)
               return res.status(400).json({
                  success: false,
                  message: "tokensupply not found in the NFT "+i+" body !"
               });

            if (!req.body.nftdata[i].supplytype)
               return res.status(400).json({
                  success: false,
                  message: "supplytype not found in the NFT "+i+" body !"
               });   

            if (!req.body.nftdata[i].imageartisttype)
               return res.status(400).json({
                  success: false,
                  message: "imageartisttype not found in the NFT "+i+" body !"
               });

            if (!req.body.nftdata[i].producertype)
               return res.status(400).json({
                  success: false,
                  message: "producertype not found in the NFT "+i+" body !"
               });

            if (!req.body.nftdata[i].executiveproducertype)
               return res.status(400).json({
                  success: false,
                  message: "executiveproducertype not found in the NFT "+i+" body !"
               });

            if (!req.body.nftdata[i].fantype)
               return res.status(400).json({
                  success: false,
                  message: "fantype not found in the NFT "+i+" body !"
               });   

            if(!req.body.nftdata[i].ImageArtistName)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ImageArtistName not found in the NFT "+i+" body !"
                  });
            }

            if(!req.body.nftdata[i].ImageArtistProfile)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ImageArtistProfile not found in the NFT "+i+" body !"
                  });
            } 
            if(!req.body.nftdata[i].ImageArtistWebsite)
            {
                  return res.status(400).json({
                        success: false,
                        message: "ImageArtistWebsite not found in the NFT "+i+" body !"
                     });
            }
            if(!req.body.nftdata[i].ImageArtistAbout)
            {
                  return res.status(400).json({
                        success: false,
                        message: "ImageArtistAbout not found in the NFT "+i+" body !"
                     });
            }  

            if(!req.body.nftdata[i].ProducerName)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ProducerName not found in the NFT "+i+" body !"
                  });
            }
            if(!req.body.nftdata[i].ProducerProfile)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ProducerProfile not found in the NFT "+i+" body !"
                  });
            } 

            if(!req.body.nftdata[i].ProducerInspiration)
            {
                  return res.status(400).json({
                        success: false,
                        message: "ProducerInspiration not found in the NFT "+i+" body !"
                     });
            }  
            
            if(!req.body.nftdata[i].ExecutiveProducerName)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ExecutiveProducerName not found in the NFT "+i+" body !"
                  });
            }
            if(!req.body.nftdata[i].ExecutiveProducerProfile)
            {
                 return res.status(400).json({
                     success: false,
                     message: "ExecutiveProducerProfile not found in the NFT "+i+" body !"
                  });
            } 
            
            if(!req.body.nftdata[i].ExecutiveProducerInspiration)
            {
                  return res.status(400).json({
                        success: false,
                        message: "ExecutiveProducerInspiration not found in the NFT "+i+" body !"
                     });
            }
            
            if(!req.body.nftdata[i].FanName)
            {
                 return res.status(400).json({
                     success: false,
                     message: "FanName not found in the NFT "+i+" body !"
                  });
            }
            if(!req.body.nftdata[i].FanProfile)
            {
                 return res.status(400).json({
                     success: false,
                     message: "FanProfile not found in the NFT "+i+" body !"
                  });
            } 
            
            if(!req.body.nftdata[i].FanInspiration)
            {
                  return res.status(400).json({
                        success: false,
                        message: "FanInspiration not found in the NFT "+i+" body !"
                     });
            }  

            if(!req.body.nftdata[i].other)
            {
                  return res.status(400).json({
                        success: false,
                        message: "other not found in the NFT "+i+" body !"
                     });
            } 

            if (!req.body.nftdata[i].collectiontype)
            return res.status(400).json({
               success: false,
               message: "collectiontype not found in the NFT "+i+" body !"
            });

            if(req.body.nftdata[i].collectiontype == "New")
            {
               if (!req.body.nftdata[i].collectiontitle)
               return res.status(400).json({
                  success: false,
                  message: "collectiontitle not found in the NFT "+i+" body !"
               });
            }

            if(req.body.nftdata[i].collectiontype == "Existing")
            {
               if (!req.body.nftdata[i].collectionId)
               return res.status(400).json({
                  success: false,
                  message: "collectionId not found in the NFT "+i+" body !"
               }); 
            }
         }
           
         for(var i=0;i<req.body.nftdata.length;i++)
         {
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
            var newNft = new NftModel({
               adminId:result._id,
               nftId: req.body.nftdata[i].nftId,
               title: req.body.nftdata[i].title,
               description: req.body.nftdata[i].description,
               type: req.body.nftdata[i].type,
               artwork: req.body.nftdata[i].artwork,
               tokensupply: req.body.nftdata[i].tokensupply,
               tokensupplyalternative: req.body.nftdata[i].tokensupply,
               supplytype: req.body.nftdata[i].supplytype,
               ImageArtistName:req.body.nftdata[i].ImageArtistName,
               ImageArtistProfile:req.body.nftdata[i].ImageArtistProfile,
               ImageArtistWebsite:req.body.nftdata[i].ImageArtistWebsite,
               ImageArtistAbout:req.body.nftdata[i].ImageArtistAbout,
               ProducerName:req.body.nftdata[i].ProducerName,
               ProducerProfile:req.body.nftdata[i].ProducerProfile,
               ProducerInspiration:req.body.nftdata[i].ProducerInspiration,
               ExecutiveProducerName:req.body.nftdata[i].ExecutiveProducerName,
               ExecutiveProducerProfile:req.body.nftdata[i].ExecutiveProducerProfile,
               ExecutiveProducerInspiration:req.body.nftdata[i].ExecutiveProducerInspiration,
               FanName:req.body.nftdata[i].FanName,
               FanProfile:req.body.nftdata[i].FanProfile,
               FanInspiration:req.body.nftdata[i].FanInspiration,
               other:req.body.nftdata[i].other
            })

            const nftcreationresult =await NftModel.create(newNft);

            console.log("New NFT created : ", nftcreationresult);

            
            if(req.body.nftdata[i].imageartisttype == "New")
            {
               var newprofile = new profileModel({
                  role:"Image Artist",
                  Name:req.body.nftdata[i].ImageArtistName,
                  Profile:req.body.nftdata[i].ImageArtistProfile,
                  Website:req.body.nftdata[i].ImageArtistWebsite,
                  About:req.body.nftdata[i].ImageArtistAbout
               })
               await profileModel.create(newprofile);
            }      
            
            if(req.body.nftdata[i].producertype == "New")
            {
               var newprofile = new profileModel({
                  role:"Producer",
                  Name:req.body.nftdata[i].ProducerName,
                  Profile:req.body.nftdata[i].ProducerProfile,
                  Inspiration:req.body.nftdata[i].ProducerInspiration,
                })
                await profileModel.create(newprofile);
            }
            
            if(req.body.nftdata[i].executiveproducertype == "New")
            {
               var newprofile = new profileModel({
                  role:"Executive Producer",
                  Name:req.body.nftdata[i].ExecutiveProducerName,
                  Profile:req.body.nftdata[i].ExecutiveProducerProfile,
                  Inspiration:req.body.nftdata[i].ExecutiveProducerInspiration,
                })
                await profileModel.create(newprofile);
            }
            
            if(req.body.nftdata[i].fantype == "New")
            {
               var newprofile = new profileModel({
                  role:"Fan",
                  Name:req.body.nftdata[i].FanName,
                  Profile:req.body.nftdata[i].FanProfile,
                  Inspiration:req.body.nftdata[i].FanInspiration,
                })
                await profileModel.create(newprofile);
            }

            if(req.body.nftdata[i].collectiontype == "New")
            {
               var result = await NftModel.findOne({
                  _id: newNft._id
               });
               
               var newCollection = new collectionModel({
                  nftId:newNft._id,
                  image: result.artwork,
                  collectiontitle: req.body.nftdata[i].collectiontitle
                })

               await collectionModel.create(newCollection); 

               console.log("New collection created.");
            }
            else if(req.body.nftdata[i].collectiontype == "Existing")
            {
               var existingCollection = await collectionModel.findOne({
                  _id:req.body.nftdata[i].collectionId 
               });
               if(!existingCollection)
               {
                  return res.status(400).json({
                     success: false,
                     message: "Collection not found against this collection id!"
                  });
               }
               existingCollection.nftId.push(newNft._id);
               await existingCollection.save();
            }
         } 
            return res.status(200).json({
               success: true,
               message: "New NFTs successfully created!"
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