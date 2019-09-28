const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const CustomerSchema = new Schema({
	name: { type: String, required: true, max: 100, min: 3 },
	email: { type: String, required: true, unique: true, trim: true },
	contact: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	subscriptions: [{ type: Schema.ObjectId, ref: 'Subscription', default: null }],
	salt: String,
	temp_str: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.virtual('url').get(function () {
	return '/customer/' + this._id;
});

CustomerSchema.virtual('updated_at_formatted').get(function () {
	return moment(this.updatedAt).format('MMMM Do, YYYY');
});

CustomerSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updated_at: new Date() });
	this.save(callback);
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = {
	Customer: Customer
}