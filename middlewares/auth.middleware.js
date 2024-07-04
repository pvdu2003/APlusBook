function authMiddleware(req, res, next) {
  const user = req.cookies.user;
  if (user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}
module.exports = authMiddleware;
