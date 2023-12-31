const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

// Authentication using passport
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     function(email, password, done){
//         // find a user and establish the identity
//         User.findOne({email: email}, function(err, user){
//             if(err){
//                 console.log('Error in finding user --> Passport');
//                 return done(err);
//             }

//             if(!user || user.password != password){
//                 console.log('Invalid Username/Password');
//                 return done(null, false);
//             }

//             return done(null, user);
//         });
//     }
// )); 
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function(email, password, done){
    try {
        // find a user and establish the identity
        const user = await User.findOne({ email: email });
        if (!user || user.password !== password) {
            console.log('Invalid Username/Password');
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
}));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding user --> Passport');
//             return done(err);
//         }

//         return done(null, user);
//     });
// });
passport.deserializeUser(function(id, done){
    User.findById(id)
        .then(user => {
            if (!user) {
                // Handle the case when the user is not found
                console.log('User not found');
                return done(null, false);
            }
            return done(null, user);
        })
        .catch(err => {
            // Handle errors
            console.log('Error in finding user --> Passport');
            return done(err);
        });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/sign_in');
}

passport.setAuthenticatedUser = function(req, res, next){
    // req.user contains the current signed in user from the session cookie and we are just sending his to the locals for the views
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;