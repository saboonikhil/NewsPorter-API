const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    name: { type: String, required: true, max: 100, min: 3 },
    email: { type: String, required: true, unique: true, trim: true },
    contact: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    customers: [{ type: Schema.ObjectId, ref: 'Customer', default: null }],
    salt: String,
    temp_str: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

VendorSchema.virtual('url').get(function () {
    return '/vendor/' + this._id;
})

VendorSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = {
    Vendor: Vendor
}