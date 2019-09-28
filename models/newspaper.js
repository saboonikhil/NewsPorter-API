const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewspaperSchema = new Schema({
	name: { type: String, default: null },
	rate: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

NewspaperSchema.virtual('url').get(function () {
	return '/newspaper/' + this._id;
})

NewspaperSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updatedAt: new Date() });
	this.save(callback);
});

const Newspaper = mongoose.model('Newspaper', NewspaperSchema);

module.exports = {
	Newspaper: Newspaper
}