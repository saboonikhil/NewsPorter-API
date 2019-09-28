const Subscription = require('../models/subscription').Subscription;

exports.add_subscription = function (req, res, next) {
	const subscription = new Subscription(req.body);
	subscription.save(function (err) {
		if (err) return next(err);
		res.status(201);
		res.json({ 'response': "New subscription added" });
	});
};

exports.subscription_update = function (req, res, next) {
	Subscription.findById(req.params.sID).exec(function (err, result) {
		if (err) return next(err);
		if (!result) {
			err = new Error('Failed to load subscription');
			err.status = 404;
			return next(err);
		}
		req.subscription = result;
		req.subscription.update(req.body, function (err, result) {
			if (err) return next(err);
			res.json(result);
		});
	});
};