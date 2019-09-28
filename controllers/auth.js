const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer').Customer;
const Vendor = require('../models/vendor').Vendor;

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const auth = {
	signin: function (req, res) {
		var role = '';
		const email = req.body.email;
		const password = req.body.password;

		if (email == "vendor@newsporter.com")
			role = "vendor";
		else
			role = "customer";

		if (email == '' || password == '') {
			res.status(401);
			res.json({ "response": "Invalid Credentials", 'res': false });
			return;
		}

		if (role == "vendor") {
			auth.validateVendor(email, password, function (dbVendorObj) {
				if (!dbVendorObj) {
					res.status(401);
					res.json({ "response": "Invalid Credentials", 'res': false });
					return;
				}
				if (dbVendorObj) {
					if (dbVendorObj.res) {
						Vendor.findById(dbVendorObj.vendor.id).exec(function (err, vendor) {
							if (err) return next(err);
							res.json({ 'response': "Logged In Successfully", 'res': true, 'token': genToken(vendor) });
						});
					}
					else {
						res.json(dbVendorObj);
					}
				}
			});
		}
		else {
			auth.validate(email, password, function (dbCustomerObj) {
				if (!dbCustomerObj) {
					res.status(401);
					res.json({ "response": "Invalid Credentials", 'res': false });
					return;
				}
				if (dbCustomerObj) {
					if (dbCustomerObj.res) {
						Customer.findById(dbCustomerObj.customer.id).exec(function (err, customer) {
							if (err) return next(err);
							res.json({ 'response': "Logged In Successfully", 'res': true, 'token': genToken(customer) });
						});
					}
					else {
						res.json(dbCustomerObj);
					}
				}
			});
		}
	},

	validate: function (email, password, callback) {
		Customer.find({ email: email }, function (err, customers) {
			if (customers.length != 0) {
				const temp = customers[0].salt;
				const hash_db = customers[0].password;
				const id = customers[0].token;
				const newpass = temp + password;
				const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
				if (hash_db == hashed_password) {
					callback({ 'customer': customers[0], 'res': true });
				}
				else {
					callback({ 'response': "Invalid Password", 'res': false });
				}
			} else {
				callback({ 'response': "Email Not Registered", 'res': false });
			}
		});
	},

	validateVendor: function (email, password, callback) {
		Vendor.find({ email: email }, function (err, vendors) {
			if (vendors.length != 0) {
				const temp = vendors[0].salt;
				const hash_db = vendors[0].password;
				const id = vendors[0].token;
				const newpass = temp + password;
				const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
				if (hash_db == hashed_password) {
					callback({ 'vendor': vendors[0], 'res': true });
				}
				else {
					callback({ 'response': "Invalid Password", 'res': false });
				}
			}
			else {
				callback({ 'response': "Email Not Registered", 'res': false });
			}
		});
	},

	validateCustomer: function (email, callback) {
		Customer.find({ email: email }, function (err, customers) {
			if (customers.length != 0) {
				callback({ 'customer': customers[0], 'res': true });
			}
			else {
				Vendor.find({ email: email }, function (err, vendors) {
					if (vendors.length != 0)
						callback({ 'customer': vendors[0], 'res': true, 'role': 'admin' });
					else {
						callback({ 'response': "Email Not Registered", 'res': false });
					}
				})
			}
		});
	}
}

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

module.exports = auth;