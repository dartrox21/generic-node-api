const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const CustomErrorMessages = require('../exceptionHandler/CustomErrorMessages');
const ROLES = require('./Role.enum');

let validRoles = {
    values: [ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.USER],
    message: CustomErrorMessages.INVALID_ROLE
}

let Schema = mongoose.Schema;

let Role = new Schema({
    name: {
        type: String,
        required: [true, CustomErrorMessages.FIELD_MAY_NOT_BE_EMPTY],
        unique: true,
        enum: validRoles
    }
},
{ 
    collection: 'role' 
});

Role.plugin(uniqueValidator, {
    message: CustomErrorMessages.MUST_BE_UNIQUE
});

module.exports = mongoose.model('role', Role);
