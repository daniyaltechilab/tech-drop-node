const jwt = require('../utils/jwt');
const userModel = require('../models/UserModel');
const passport = require("passport");

require('dotenv').config();

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;


module.exports.verifyToken = async function (req, res, next) {
  // let token = req.cookies.Authorization;
  let token = req.get("Authorization")

  if (!token) {
    return res.status(401).send('You are not logged-in (token not found) !!');
  }

  if (token.includes("Bearer"))
    token = token.slice(7);

  // console.log("Authorization token : " + token);

  let result = await jwt.verify(token);

  // console.log("result jwt.verify : ", result);

  if (!result) {
    return res.status(401).send('Unauthorized access (invalid token) !!');
  }

  next();
}

// 03125202972


var cookieExtractor = function (req) {
  var token = req.get("Authorization")



  if (token.includes("Bearer"))
    token = token.slice(7);
  // console.log("cookieExtractor token : " + token);

  // if (req && req.cookies) {
  //   token = req.cookies.Authorization;
  //   console.log("cookieExtractor token : " + token);
  // }

  return token;
};

// console.log("Req.cookies.user : " + req.cookies.user);

// if(!req.cookies.user)
// {
//   return res.status(401).send('Your are not logged in..!!');
// }


var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("bearer");
opts.secretOrKey = process.env.TOKEN_KEY;
// opts.issuer = "mingaproject.com";
// opts.audience = "mingaproject.com";
opts.ignoreExpiration = true;
opts.ignoreNotBefore = true;
// opts.algorithm = ["RS256"];


// console.log("opts : ", opts);

// var result = await passport.use(new JwtStrategy(opts));
// console.log("result passport-jwt : ", result);

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    // console.log("jwt_payload : ",jwt_payload);
    
    var user = {
      username: jwt_payload.username,
      address: jwt_payload.address,
      network: jwt_payload.network,
      roles:jwt_payload.roles
    }

    return done(null, user);

    // userModel.findOne({ _id: jwt_payload.id }, function (err, user) {
    //   if (err) {
    //     return done(err, false);
    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //     // or you could create a new account
    //   }
    // });
  })
);