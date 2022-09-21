var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

var uploadtoS3Route = require("./routes/uploadtoS3route");
var indexRouter = require("./routes/index");
var userAuthRoutes = require("./routes/userAuthRoutes");
var userRoutes = require("./routes/userRoutes");
var nftRoutes = require("./routes/nftroutes");
var tokenRoutes = require("./routes/tokenRoutes");
var collectionRoutes = require("./routes/collectionroutes");
var dropRoutes = require("./routes/droproutes");
var dropcubeshistoryRoutes = require("./routes/dropcubeshistoryRoutes");
var adminclaimfundsRoutes = require("./routes/adminclaimfunds");
var userclaimfundsRoutes = require("./routes/userclaimfunds");
var auctionRoutes = require("./routes/auctionRoutes");
var usercubeshistoryRoutes = require("./routes/usercubeshistoryRoutes");
var seasonRoutes = require("./routes/seasonroutes");
var profileRoutes = require("./routes/profileroutes");
var transactionRoutes = require("./routes/transactionRoutes");
var marketPlaceRoutes = require("./routes/marketPlaceRoutes");

require("./utils/eventsListner");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

const corsOption = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOption));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const headerMiddleware = require("./middlewares/HeaderMiddleware");
app.use(headerMiddleware);

var DB_URL;

if (process.env.NODE_MODE == "developing") {
  DB_URL = process.env.DATABASE_URL_LOCAL;
} else {
  DB_URL = process.env.MONGODB_ATLAST_DATABASE_URL;
}

const DBConnect = async () => {
  const conn = await mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

DBConnect();

app.use("/upload", uploadtoS3Route);
app.use("/", indexRouter);
app.use("/user/auth", userAuthRoutes);
app.use("/users", userRoutes);
app.use("/nft", nftRoutes);
app.use("/token", tokenRoutes);
app.use("/collection", collectionRoutes);
app.use("/drop", dropRoutes);
app.use("/dropcubehistory", dropcubeshistoryRoutes);
app.use("/adminclaimfunds", adminclaimfundsRoutes);
app.use("/userclaimfunds", userclaimfundsRoutes);
app.use("/auction", auctionRoutes);
app.use("/usercubehistory", usercubeshistoryRoutes);
app.use("/season", seasonRoutes);
app.use("/profile", profileRoutes);
app.use("/transaction", transactionRoutes);
app.use("/marketPlace", marketPlaceRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
