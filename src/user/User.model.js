const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const CustomErrorMessages = require('../exceptionHandler/CustomErrorMessages');
const { encrypt } = require('../utils/util.functions');

let Schema = mongoose.Schema;

let User = new Schema({
    email: {
        type: String,
        required: [true, CustomErrorMessages.FIELD_MAY_NOT_BE_EMPTY],
        unique: true
    },
    password: {
        type: String,
        required: [true, CustomErrorMessages.FIELD_MAY_NOT_BE_EMPTY]
    },
    name: {
        type: String,
        required: [true, CustomErrorMessages.FIELD_MAY_NOT_BE_EMPTY]
    },
    lastName: {
        type: String,
        required: [true, CustomErrorMessages.FIELD_MAY_NOT_BE_EMPTY]
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, 
{ 
    collection: 'user' 
});

User.plugin(uniqueValidator, {
    message: CustomErrorMessages.MUST_BE_UNIQUE
});

/**
 * Previous a user creatin the password will be encripted
 */
User.pre('save', async function () {
    const user = this;
    const hash = await encrypt(user.password);
    user.password = hash;
});

const autoPopulateRole = function(next) {
    this.populate('role');
    next();
};

/**
 * Previous a findById & findByIdAndUpdate the role will be populated
 */
User.pre('find', autoPopulateRole)
    .pre('findOne', autoPopulateRole)
    .pre('findOneAndUpdate', autoPopulateRole);

module.exports = mongoose.model('user', User);
