const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: {type:String, required:true, enum: ['Admin', 'NotAdmin'], default:"NotAdmin"},
});

// Password hashing
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


// compare passwords
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };
  

module.exports = mongoose.model('User', UserSchema);
