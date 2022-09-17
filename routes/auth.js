const express = require('express');
const { StatusCodes } = require('http-status-codes');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
const logout = require('express-passport-logout');

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

// FACEBOOK
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/facebook/callback', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

// LOCAL
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

router.post('/register', async (req, res, next) => {
    await User.create({ ...req.body });
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

// LOGOUT
router.get('/logout', (req, res) => {
    console.log(req.session);

    req.logout();
    res.send('ok');
});

// COMPANY LOGIN
router.post('/company_login', async (req, res, next) => {
    passport.authenticate('company-local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

// ADMIN LOGIN
router.post('/admin_login', async (req, res, next) => {
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) throw err;
        if (!user)
            res.status(StatusCodes.UNAUTHORIZED).json({
                msg: 'No User Exists',
            });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.status(StatusCodes.OK).json({
                    user,
                });
            });
        }
    })(req, res, next);
});

module.exports = router;
