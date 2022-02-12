// this file contains middlewares to manage routes access

// checking if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.session.currentUser) {
    res.redirect("/user/login");
  } else {
    next();
  }
}

// checking if user is logged out
function isLoggedOut(req, res, next) {
  if (req.session.currentUser) {
    res.redirect("/");
  } else {
    next();
  }
}

module.exports = { isLoggedIn, isLoggedOut };
