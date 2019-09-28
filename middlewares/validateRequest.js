const jwt = require('jsonwebtoken');
const validateCustomer = require('../controllers/auth').validateCustomer;

module.exports = function (req, res, next) {

    // When performing a cross domain request, a
    // a preflighted request is received first. This is to check if the app
    // is safe. 

    // token outh for [OPTIONS] requests is skipped
    //if(req.method == 'OPTIONS') next();
    //TOKEN: To be put in request
    //KEY: Current email of logged in customer
    const token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];
    const key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    //console.log(key);
    if (token || key) {
        try {
            const decoded = jwt.decode(token, require('../config/secret.js')());
            //console.log(decoded);
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({ "response": "Token Expired", "res": false });
                return;
            }
            validateCustomer(key, function (dbCustomer) {
                if (!dbCustomer) {
                    res.status(401);
                    res.json({ "response": "Invalid Credentials", 'res': false });
                    return;
                }
                // Authorize the customer to see if s/he can access the app
                if (dbCustomer) {
                    if (dbCustomer.res) {
                        if (req.url.indexOf('/api/') >= 0)
                            next(); // To move to next middleware
                        else {
                            res.status(403);
                            res.json({ "response": "Not Authorized", "res": false });
                            return;
                        }
                    }
                }
            });
        } catch (err) {
            res.status(500);
            res.json({ "response": "Oops something went wrong", "res": false, "error": err });
        }
    }
    else {
        res.status(401);
        res.json({ "response": "Invalid Token or Key", "res": false });
        return;
    }
};