const GoogleStartegy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const OAuthUser = require('../models/OAuthUser');
const User = require('../models/User');
const CompanyLogin = require('../models/CompanyLogin');
const Admin = require('../models/Admin');

module.exports = function (passport) {
    //configuring the strategy which means how am i going to authenticate and with what
    passport.use(
        new GoogleStartegy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const { id, displayName, photos, provider } = profile;
                const newUser = {
                    authId: id,
                    name: displayName,
                    img: photos[0].value,
                    provider: provider,
                };
                try {
                    let user = await OAuthUser.findOne({ authId: id });

                    if (user) {
                        console.log(user);
                        done(null, user);
                    } else {
                        user = await OAuthUser.create(newUser);
                        done(null, user);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        )
    );

    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'displayName', 'picture.type(large)'],
            },
            async (token, refreshToken, profile, done) => {
                const { id, displayName, photos, provider } = profile;
                const newUser = {
                    authId: id,
                    name: displayName,
                    img: photos[0].value,
                    provider: provider,
                };
                try {
                    let user = await OAuthUser.findOne({ authId: id });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await OAuthUser.create(newUser);
                        done(null, user);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        )
    );

    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            async function verify(username, password, done) {
                try {
                    const user = await User.findOne({ email: username });
                    if (!user) {
                        return done(null, false, {
                            msg: 'incorrect email or password',
                        });
                    }

                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isMatch) {
                        return done(null, false, {
                            msg: 'incorrect email or password',
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        'company-local',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password', // this is the virtual field on the model
            },
            async function verify(username, password, done) {
                try {
                    const company = await CompanyLogin.findOne({ username });
                    if (!company) {
                        return done(null, false, {
                            msg: 'incorrect username or password',
                        });
                    }

                    const isMatch = await bcrypt.compare(
                        password,
                        company.password
                    );

                    if (!isMatch) {
                        return done(null, false, {
                            msg: 'incorrect username or password',
                        });
                    }
                    return done(null, company);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        'admin-local',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
            },
            async function verify(username, password, done) {
                try {
                    const admin = await Admin.findOne({ username });
                    if (!admin) {
                        return done(null, false, {
                            msg: 'incorrect username or password',
                        });
                    }
                    if (password !== admin.password) {
                        return done(null, false, {
                            msg: 'incorrect username or password',
                        });
                    }
                    return done(null, admin);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    //these two functions are for sessions
    passport.serializeUser(function (user, done) {
        done(null, {
            id: user.id,
            type: user.provider,
            company_id: user.company_id, //if exists
        });
    });

    passport.deserializeUser(function (user, done) {
        if (user.type === 'local') {
            User.findById(user.id, (err, user) => done(err, user));
        } else if (user.type === 'admin') {
            Admin.findById(user.id, (err, user) => done(err, user));
        } else if (!user.type) {
            CompanyLogin.findById(user.id, (err, user) => done(err, user));
        } else {
            OAuthUser.findById(user.id, (err, user) => done(err, user));
        }
    });
};
