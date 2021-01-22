const LocalStrategy = require('passport-local').Strategy;

// const { Contestant } = _include('components/contestant');

module.exports = function(passport, Strategy=LocalStrategy, Model) {
    // SERIALIZE USER

    passport.serializeUser(function(user, done) {
        done(null, user.slug);
    });

    // DESERIALIZE USER
    passport.deserializeUser(function(id, done) {
        Model.findOne({ slug: id }, function(err, user) {
            done(err, user);
        })
    });

    // LOCAL SIGNUP
    passport.use('local-login', new Strategy(
        {
            // By Default, local strategy uses username and password, we will overide with email.
            usernameField: 'email',
            passwordField: 'password',
        },
        function(email, password, done) {
            //find a user
            Model.findOne( { email }, function(err, user) {
                console.log(email, password);
                console.log(user);
                // return errors, if any
                if (err) return done(err);

                // if no user or password is incorrect
                if (!user || !user.validPassword(password)) 
                    return done(null, false, { message: 'Incorrect Email or Password!' });
                
                // if user exists and password is correct
                return done(null, user);
            })
        }
    ))
    passport.use('local-login2', new Strategy(
        {
            // By Default, local strategy uses username and password, we will overide with email.
            usernameField: 'email',
            passwordField: 'password',
        },
        async function(email, password, done) {
            //find a user
            const { err, user } = await Model.findOne( { email });

            console.log('ooooooo', err, user);
        }
    ))
}