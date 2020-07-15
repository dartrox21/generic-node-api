const router = require('express').Router();
const { validateAuthUser } = require('./auth.middleware');
const AuthService = require('./AuthService');
const { asyncWrapper } = require('../utils/util.functions');

router.get('/auth/login', validateAuthUser, asyncWrapper(AuthService.login));

module.exports = router;
