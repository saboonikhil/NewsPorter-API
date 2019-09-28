const Customer = require('../models/customer').Customer;

exports.subscriptions_list = function (req, res, next) {
	Customer.findById(req.params.cID).populate('subscriptions').exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load user');
			err.status = 404;
			return next(err);
		}
		res.json(result.subscriptions);
	})
};