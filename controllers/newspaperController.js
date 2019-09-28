const Newspaper = require('../models/newspaper').Newspaper;

exports.newspapers_list = function (req, res, next) {
    Newspaper.find({}).sort({ createdAt: -1 }).exec(function (err, newspapers) {
        if (err) return next(err);
        res.json(newspapers);
    });
}