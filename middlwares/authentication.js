const { UnauthenticatedError } = require('../errors/index');
const Company = require('../models/Company');

module.exports = {
    // USER LEVEL
    authenticationMiddleware: (req, res, next) => {
        if (req.isAuthenticated() && req.user.provider) return next();
        throw new UnauthenticatedError('not authorized');
    },
    // COMPANY LEVEL
    companyAuthenticated: async (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.provider === 'admin') {
                return next();
            }
            if (req.user.company_id) {
                const company = await Company.findById({
                    _id: req.user.company_id,
                });
                if (!company) {
                    throw new UnauthenticatedError('not authorized');
                }
                return next();
            } else {
                throw new UnauthenticatedError('not authorized');
            }
        }
        throw new UnauthenticatedError('not authorized');
    },
    // ADMIN LEVEL
    adminAuthenticated: async (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.provider === 'admin') {
                return next();
            }
        }
        throw new UnauthenticatedError('not authorized');
    },
};
