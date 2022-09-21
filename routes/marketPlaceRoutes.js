var express = require('express');
var router = express.Router();

const auth = require('../middlewares/auth')
const passport = require('passport')
const verifyUser = passport.authenticate("jwt", {
    session: false
});

const auctionModel = require('../models/auctionModel');
const TokenModel = require('../models/tokenModel');
const NftModel = require('../models/nftModel');

router.route('/tokenIds/:start/:end')
    .get(
        async function (req, res, next) {

            try {

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

                var userauctiondata1 = await auctionModel.find({check:"auction"});
                var usersaledata1 = await auctionModel.find({check:"sale"});

                var userauctiondata=userauctiondata1.reverse();
                var usersaledata=usersaledata1.reverse();

                var paginationresult1= userauctiondata.slice(req.params.start,req.params.end);
                var paginationresult2= usersaledata.slice(req.params.start,req.params.end);
                var auctiontokendata=[];
                var auctionnftdata=[];
                var saletokendata=[];
                var salenftdata=[];
                for (var j=0;j<paginationresult1.length;j++)
                {
                    var tokenresult = await TokenModel.findOne({_id: paginationresult1[j].tokenId});
                    auctiontokendata.push(tokenresult);
                    var data2=[];
                    for(var i=0;i<tokenresult.nftids.length;i++)
                    {
                        console.log("NftId"+" at "+i+"index is = "+tokenresult.nftids[i]);
                        var nftdata=await NftModel.findOne({_id:tokenresult.nftids[i]});
                        console.log("Nftdata"+" at "+i+"index is = "+nftdata);
                        data2.push(nftdata);
                    }
                    auctionnftdata.push(data2);
                }
                for (var j=0;j<paginationresult2.length;j++)
                {
                    var tokenresult = await TokenModel.findOne({_id: paginationresult2[j].tokenId});
                    saletokendata.push(tokenresult);
                    var data=[];
                    for(var i=0;i<tokenresult.nftids.length;i++)
                    {
                        console.log("NftId"+" at "+i+"index is = "+tokenresult.nftids[i]);
                        var nftdata=await NftModel.findOne({_id:tokenresult.nftids[i]});
                        console.log("Nftdata"+" at "+i+"index is = "+nftdata);
                        data.push(nftdata);
                    }
                    salenftdata.push(data);
                }
                return res.status(200).json({
                    success: true,
                    Userauctiondata: paginationresult1,
                    Auctiontokendata: auctiontokendata,
                    Auctionnftdata: auctionnftdata,
                    Saletokendata: saletokendata,
                    Salenftdata: salenftdata,
                    Usersaledata: paginationresult2,
                    Auctioncount:userauctiondata.length,
                    Salecount:usersaledata.length
                });

            } catch (error) {
                console.log("error (try-catch) : " + error);
                return res.status(500).json({
                    success: false,
                    err: error
                });
            }
        })


module.exports = router;