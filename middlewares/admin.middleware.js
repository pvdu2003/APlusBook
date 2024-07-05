function adminMiddleware(req, res, next) {
  const user = req.cookies.user;
  if (user.role === "admin") {
    next();
  } else {
    res.redirect("/");
  }
}
module.exports = adminMiddleware;
