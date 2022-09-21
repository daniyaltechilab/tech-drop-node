const checkIsInRole = (...roles) => (req, res, next) => {
  // console.log(req.cookies.Authorization);
  if (!req.user) {
    return res.status(401).send('user not found');
  }

  const hasRole = roles.find((role) => req.user.roles.includes(role));
  if (!hasRole) {
    return res.status(400).send('Missuse Detected');
  }

  return next();
};

module.exports.checkIsInRole = checkIsInRole;
