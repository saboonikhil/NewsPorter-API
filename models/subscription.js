const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	isAvailable: { type: Boolean, default: true },
	item: { type: Schema.ObjectId, ref: 'Newspaper', required: true },
	startDate: { type: String, required: true },
	endDate: { type: String, default: null },
	cycle: { type: String, default: null, enum: ['Weekend, Weekdays'] },
	amount: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

SubscriptionSchema.virtual('url').get(function () {
	return '/subscription/' + this._id;
});

SubscriptionSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updatedAt: new Date() });
	this.save(callback);
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = {
	Subscription: Subscription
}