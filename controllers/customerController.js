const Customer = require('../models/customer').Customer;
const jwt = require('jsonwebtoken');
const rand = require('csprng');
const crypto = require('crypto');

exports.create_customer = function (req, res, next) {
	const customer = new Customer(req.body);
	const email = customer.email;
	const password = customer.password;

	if (!(email.indexOf("@") + 1 == email.length)) {
		if (password.length > 4) {
			const temp = rand(160, 36);
			const newpass = temp + password;
			const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
			customer.password = hashed_password;
			customer.salt = temp;
			Customer.find({ email: email }, function (err, customers) {
				const len = customers.length;
				if (len == 0) {
					customer.save(function (err, customer) {
						if (err) return next(err);
						res.status(201);
						res.json({ 'response': "Sucessfully Registered", 'res': true, 'token': genToken(customer) });
					});
				}
				else {
					res.status(401);
					res.json({ 'response': "Email already registered", 'res': false });
				}
			});
		}
		else {
			res.status(401);
			res.json({ 'response': "Password must be of minimum length 5 characters", 'res': false });
		}
	}
	else {
		res.status(401);
		res.json({ 'response': "Email not valid", 'res': false });
	}
};

function genToken(dbObj) {
	const expires = expiresIn(180); //180 days
	const token = jwt.sign({
		exp: expires
	}, require('../config/secret')());

	return {
		token: token,
		expires: expires,
		dbObj: dbObj
	};
}

function expiresIn(numDays) {
	const dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

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