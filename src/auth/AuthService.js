const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const CustomValidateException = require('../exceptionHandler/CustomValidateException');
const CustomErrorMessages = require('../exceptionHandler/CustomErrorMessages');
const UserService = require('../user/UserService');
const bcrypt = require('bcrypt');

class AuthService {
    constructor() { 
        this.login = this.login.bind(this);
     }

    async login(req, res) {
        const userLogin = req.body;
        const user = await UserService.findByEmail(req.body.email);
        const hasValidCredentials = await bcrypt.compare(userLogin.password, user.password);
        if(!hasValidCredentials) {
            throw CustomValidateException.conflict().errorMessage(CustomErrorMessages.BAD_CREDENTIALS).build();
        }
        delete user.password;
        jwt.sign(user.toJSON(), process.env.SECRET, {expiresIn: process.env.EXP_DATE}, (err, token) => {
            if(err) {
                throw CustomValidateException.conflict().errorMessage(CustomErrorMessages.BAD_CREDENTIALS).build();
            } else {
                res.setHeader('Authorization', `Bearer ${token}`);
                res.status(HttpStatus.OK).send();
            }
        });
    }
}

module.exports = new AuthService();
