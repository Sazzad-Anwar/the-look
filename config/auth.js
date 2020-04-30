module.exports = {

  //This is custom middlewear function which will resist a user to move into dashbord,photo posting page if a user is not 
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource'); // if a user try to go into that password authenticated page then this flash msg will appear
    res.redirect('/login'); // then he will be moved to this route
  },

  // Once a user is authenticated then he cannot go to the registration and login page and if he tries then he would be redirected to the dashboard
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};
